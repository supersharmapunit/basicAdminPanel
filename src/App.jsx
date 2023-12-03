import { Input, Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import CustomTable from './components/CustomTable';

function App() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const filters = ["id", "name", "email", "role"];
  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    console.log('handle search for', searchText);
  };

  const handleMultipleDelete = () => {
    console.log(selectedRows);
    const filteredData = data.filter((ele) => !selectedRows.includes(ele.id));
    setData(filteredData);
    setSelectedRows([]);
  };

  return (
    <>
      <div className="searchBar flex items-center p-2 shadow-sm">
        <Input
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          type="text"
          label="Search"
          className="flex-1 w-9/12 p-3"
          value={searchText}
          onKeyDown={handleKeyDown}
        />
        <div className="filter-container flex-1">
          <Select
            label="Filter constraint"
            placeholder="Select a filter"
            className=""
            isRequired={true}
            defaultSelectedKeys={["id"]}
          >
            {filters.map((filter) => (
              <SelectItem key={filter} value={filter}>
                {filter}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Button
          className="flex-none mx-1"
          onClick={handleSearch}
          color="primary"
          variant="ghost"
        >
          Search
        </Button>
        <Button
          className="flex-none mx-1"
          onClick={handleMultipleDelete}
          color="danger"
          variant="ghost"
        >
          Multi-Delete
        </Button>
      </div>
      <div className="tableContainer">
        <CustomTable tableData={data} selectedRows={selectedRows} onSelectRows={setSelectedRows} onDelete={handleMultipleDelete} />
      </div>
    </>
  );
}

export default App;
