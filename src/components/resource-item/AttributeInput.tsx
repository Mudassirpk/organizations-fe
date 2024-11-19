import { TResource, TResourceAttribute } from "types";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from '@/components/ui/select';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../loader";


export default function AttributeInput({ attribute }: { attribute: TResourceAttribute }) {

  const { data, isFetching } = useQuery<TResource>({
    queryKey: ['attribute-relation-resource'],
    async queryFn() {
      return (await axios.get(`http://localhost:3000/resource/by-id/${attribute.relationId}?atoms=true`)).data
    },
    enabled: attribute.type === 'RESOURCE'
  })

  return <div key={attribute.id} className="space-y-2">
    <Label
      className="capitalize"
      htmlFor={attribute.id.toString()}
    >
      {attribute.name}
    </Label>
    {attribute.type === 'RESOURCE' ?
      isFetching ? <Loader /> :
        attribute.relationType === 'OTO' ?
          <Select
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"Choose " + attribute.name} />
            </SelectTrigger>
            <SelectContent>
              {data?.resource_atom.map((ra, i: number) => {
                return <>
                  <SelectItem value={ra.id.toString()} className={`py-2 cursor-pointer`}>
                    {
                      <div className="w-full flex gap-2 items-center flex-wrap p-1">{Object.keys(ra.data).map(k => {
                        return <p className="min-w-max rounded text-[16px]"><span className="p-1 px-2 bg-gray-700 rounded-tl rounded-bl text-white">{k}</span><span className="p-1 px-2 rounded-tr rounded-br bg-purple-700 text-white">{ra.data[k]}</span></p>
                      })}
                      </div>
                    }
                  </SelectItem>
                  {i !== data?.resource_atom.length - 1 && <p className="my-2 w-full border-b"></p>}
                </>
              })}
            </SelectContent>
          </Select> : null
      :
      <Input
        name={attribute.name}
        id={attribute.id.toString()}
        type="organizationId"
        placeholder={attribute.name}
        required
      />
    }
  </div>
}
