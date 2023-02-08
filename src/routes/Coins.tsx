import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;
  height: 100vh;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  margin-bottom: 10px;
  border-radius: 15px;
  a {
    display: flex;
    padding: 10px;
    padding: 20px;
    align-items: center;
    transition: all 0.2s ease-in;
  }
  :hover {
    background-color: ${(props) => props.theme.textColor};
    a {
      color: ${(props) => props.theme.bgColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.textColor};
`;

const Loader = styled.span`
  font-size: 20px;
  display: block;
  text-align: center;
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

interface CoinInterFace {
  id: string;
  name: string;
  symbol: string;
  rank: 1;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const [coins, setCoins] = useState<CoinInterFace[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const resopnse = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await resopnse.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);
  console.log(coins);
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      {loading ? (
        <Loader>"Loading..."</Loader>
      ) : (
        <CoinList>
          {coins.map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />{" "}
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}

export default Coins;
