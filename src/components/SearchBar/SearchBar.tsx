import styled from 'styled-components';
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const SearchContainer = styled.div`
  padding: 16px;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: min(400px, calc(100% - 64px));
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearch(value), 500),
    [onSearch]
  );

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search photos..."
        onChange={handleSearchInput}
      />
    </SearchContainer>
  );
};

export default SearchBar;
