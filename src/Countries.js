import React, { useState } from "react";
import { useQuery, gql } from '@apollo/client';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import "./Countries.css";


const CONTINENTS = gql`
    query {
        continents {
            name
            code
        }
    }
`;

const COUNTRIES = gql`
    query getCountries($code: ID!) {
        continent(code: $code) {
            countries {
                name,
                capital,
                currency,
                languages {
                  name
                }
                emoji
            }
        }
    }
`;


export default function Header(props) {
  const [selectedContinent, setSelectedContinent] = useState("AS");
  const [selectedContinentName, setSelectedContinentName] = useState("Asia");


  function SelectContinentDropdown() {
    const { loading, error, data } = useQuery(CONTINENTS);

  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <Form.Group controlId="selectContinent" value={selectedContinentName}>
        <Form.Control 
        as="select"
        onChange={(event) => handleCountryButtonSelect(event)}>
            <option>Select a continent</option>
        {data.continents.map(({ name, code }) => (
        <option key={code} value={[code, name]}>{name}</option>
    ))}
        </Form.Control>
        </Form.Group>
    );
  }

  function handleCountryButtonSelect(event) {
      const continentIdentifiers = event.target.value.split(",");

      setSelectedContinent(continentIdentifiers[0]);
      setSelectedContinentName(continentIdentifiers[1]);
  }


  function Countries() {
    const { loading, error, data } = useQuery(COUNTRIES, {variables: {code:selectedContinent}});
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

        const countriesList = data.continent.countries;
        return (
            <>
            {countriesList.map((country, index) => {
                return (
                    <Card className="m-3" key={index} border="dark" style={{ width: '18rem' }}>
                        <Card.Header>{country.name} {country.emoji}</Card.Header>
                        <Card.Body>
                            <p>Capital: {country.capital}</p>
                            <p>Currency: {country.currency}</p>
                            <p>Languages: {Object.entries(country.languages).map((language, index) => {
                                return `• ${language[1].name} `})}</p>
                    </Card.Body>
                    </Card>
                )
            })}
            </>
        )
  }


  return (
    <>
    <Container>
        <Row className="header-container justify-content-center">
            <h1>Continent-Country Finder</h1>
        </Row>
        <Row className="header-container justify-content-center">

            <SelectContinentDropdown />
        </Row>
        <Row className="header-container justify-content-center">
            <h2>{selectedContinentName}</h2>
        </Row>
        <Row className="header-container justify-content-center">
            <Countries />
        </Row>
    </Container>
    </>
  );
}