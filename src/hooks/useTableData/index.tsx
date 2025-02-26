import { useCallback, useEffect, useRef, useState } from "react";

export type TableData = {
  id: string;
  name: string;
  username: number;
  email: string;
  address: {
    city: string;
    zipcode: string;
  };
};

export const useTableData = ({ refetch }: { refetch?: number }) => {
  const [data, setData] = useState<TableData[]>();
  const hasFetched = useRef(false);
  const refetchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const fetchData = useCallback(async () => {
    console.log("fetching data");
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    setData(data);
    hasFetched.current = true;
    if (refetch) {
      refetchTimeout.current = setTimeout(() => {
        hasFetched.current = false;
        setData(undefined);
      }, refetch * 1000);
    }
  }, [refetch]);

  useEffect(() => {
    if (!hasFetched.current && !data) {
      fetchData();
    }
  }, [fetchData, data]);

  useEffect(() => {
    return () => {
      if (refetchTimeout.current) {
        clearTimeout(refetchTimeout.current);
      }
    };
  }, []);

  return { data, error: hasFetched.current === true && !data };
};
