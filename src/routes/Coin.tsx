import { useState, useEffect } from "react";
import {
  useLocation,
  useParams,
  useRouteMatch,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  padding: 10px 20px;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
`;
const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 40%;
  margin-top: 20px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  justify-content: center;
`;
const Overview = styled.div`
  width: 100%;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  background-color: whitesmoke;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  text-align: center;
  font-size: 15px;
  line-height: 20px;
  flex-direction: column;
  span:first-child {
    text-transform: uppercase;
    font-size: 10px;
  }
`;
const Description = styled.p`
  width: 100%;
  text-align: center;
  line-height: 20px;
`;

const Loader = styled.span`
  font-size: 20px;
  display: block;
  text-align: center;
`;

const Tabs = styled.div`
  width: 100%;
  gap: 20px;
  display: flex;
`;
const Tab = styled.span<{ isActive: boolean }>`
  width: 50%;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  background-color: white;
  transition: all 0.2s linear;
  a {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: ${(props) =>
      props.isActive ? props.theme.accentColor : props.theme.textColor};
  }
  :hover {
    background-color: ${(props) => props.theme.textColor};
    position: relative;
    animation: 1.5s linear infinite updown;
    @keyframes updown {
      0% {
        top: -5px;
      }
      50% {
        top: 2px;
      }
      100% {
        top: -5px;
      }
    }
    a {
      color: ${(props) => props.theme.bgColor};
    }
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouterState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouterState>();
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
  const priceMatch = useRouteMatch(`/${coinId}/price`);
  const chartMatch = useRouteMatch(`/${coinId}/chart`);
  console.log(chartMatch);
  console.log(priceMatch);
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);
  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>"Loading..."</Loader>
      ) : (
        <>
          <Wrapper>
            <Overview>
              <OverviewItem>
                <span>rank:</span>
                <span>{info?.rank}</span>
              </OverviewItem>
              <OverviewItem>
                <span>symbol:</span>
                <span>{info?.symbol}</span>
              </OverviewItem>
              <OverviewItem>
                <span>open source:</span>
                <span>{info?.open_source ? "YES" : "NO"}</span>
              </OverviewItem>
            </Overview>
            <Description>{info?.description}</Description>
            <Overview>
              <OverviewItem>
                <span>total supply</span>
                <span>{priceInfo?.total_supply}</span>
              </OverviewItem>
              <OverviewItem>
                <span>max supply</span>
                <span>{priceInfo?.max_supply}</span>
              </OverviewItem>
            </Overview>
            <Tabs>
              <Tab isActive={chartMatch !== null}>
                <Link to={`/${coinId}/chart`}>Chart</Link>
              </Tab>
              <Tab isActive={priceMatch !== null}>
                <Link to={`/${coinId}/price`}>Price</Link>
              </Tab>
            </Tabs>
            <Switch>
              <Route path={`/${coinId}/price`}>
                <Price />
              </Route>
              <Route path={`/${coinId}/chart`}>
                <Chart />
              </Route>
            </Switch>
          </Wrapper>
        </>
      )}
    </Container>
  );
}

export default Coin;
