import { Input, Button, Checkbox, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import CustomTable from './components/CustomTable';

function App() {

  const filters = ["id", "name", "email", "role"];
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [originalData, setOriginalData] = useState([]);


  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );
      const result = await response.json();
      setOriginalData(result);
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
    if (searchText === null || searchText === '' || searchText.length === 0) {
      setData(originalData);

    } else {
      console.log('handle search for', searchText, 'on filter', selectedFilter);
      let filteredArr;
      if (selectedFilter === 'id') {
        filteredArr = originalData.filter((ele) => {
          return ele.id === searchText
        });
      } else if (selectedFilter === 'name') {
        filteredArr = originalData.filter((ele) => {
          return ele.name.toLowerCase().includes(searchText);
        });
      } else if (selectedFilter === 'email') {
        filteredArr = originalData.filter((ele) => {
          return ele.email === searchText
        });
      } else {
        filteredArr = originalData.filter((ele) => {
          return ele.role === searchText
        });
      }
      setData(filteredArr);
      setSearchText('');
    }
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
            onChange={(e) => setSelectedFilter(e.target.value)}
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
