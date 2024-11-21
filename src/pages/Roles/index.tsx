import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {TRole} from "../../../types";
import Loader from "@/components/loader.tsx";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useAuth} from "@/store/contexts/context.tsx";
import AddRoleModal from "@/components/roles/AddRoleModal.tsx";

export default function Roles() {
    const {user} = useAuth()
    const {data: roles, isFetching} = useQuery<TRole[]>({
        queryKey: ['get-organization-roles'],
        async queryFn() {
            return (await axios.get(`http://localhost:3000/role/by-organization/${user?.user_organization[0].organizationId}`)).data;
        }
    })

    return <div>
        <div className="w-full flex justify-between items-center">
            <h2 className={'font-semibold text-2xl text-gray-700'}>Roles</h2>
            <AddRoleModal/>
        </div>
        <div className="my-4 p-2">
            {
                isFetching ? <Loader/>
                    : <div className={'w-full overflow-hidden rounded border'}>
                        <Table>
                            <TableHeader>
                                <TableRow className={'bg-gray-700 text-white font-semibold'}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Created At</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    roles?.map((role, i: number) => {
                                        return <TableRow key={role.id}
                                                         className={`${(i + 1) % 2 === 0 ? "bg-gray-200" : "bg-white"}`}>
                                            <TableCell>{role.id}</TableCell>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell>{new Date(role.createdAt).toDateString()}</TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
            }
        </div>
    </div>
};