import {Button, Card, Icon, Image, Input, Label, Message} from 'semantic-ui-react'
import {search} from "./utils/functions";
import {useState} from "react";
import 'semantic-ui-css/semantic.min.css'
import AddressCard from "./components/AddressCard";
import EthLogo from "./img/ethereum-eth-logo.svg"
import BtcLogo from "./img/cardano-ada-logo.svg"
import AdaLogo from "./img/bitcoin-btc-logo.svg"

export default function App() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [domain, setDomain] = useState('');
    const [domainData, setDomainData] = useState(null);
    document.body.style.backgroundColor = "black";

    return (
        <div style={{display: "block", width: "717px", maxWidth: "90%", margin: "50px auto", marginBottom: "10px", border: "#C9FA75", borderWidth: "thick", borderColor: "C9FA75"}}>
            <div><img src="https://media.discordapp.net/attachments/1047420970371121153/1062251157063475230/Header.png?width=717&height=448" /></div> 
            <Message info style={{textAlign: "center", color: "black", backgroundColor: "white", border: "#C9FA75", borderWidth: "thick", borderColor: "C9FA75"}}>
                <h2>ARVRtise Domain Verification</h2>
                <p>
                    Enter a ARVRtise Unstoppable domain name (registered on Ethereum Mainnet or Polygon Mainnet) to verify membership badge, owner, coupon and more.
                </p>
            </Message>

            <Message info style={{color: "black", backgroundColor: "white", border: "#C9FA75", borderWidth: "thick", borderColor: "C9FA75"}}>
                <p><b>ARVRtise Domain:</b></p>
                <Input style={{width: "100%", marginBottom: "10px", backgroundColor: "#C9FA75", color: "black"}} placeholder='Domain name'
                       onChange={(e) => setDomain(e.target.value)}/>
                <br/>
                <Button color='blue'
                        onClick={(e) => search(e, domain, setLoading, setError, setDomainData)}
                >
                    Search
                </Button>
            </Message>

            {error &&
                <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{error}</p>
                </Message>
            }

            {loading &&
                <Message icon>
                    <Icon name='circle notched' loading/>
                    <Message.Content>
                        <Message.Header>Just one second</Message.Header>
                        Fetching data...
                    </Message.Content>
                </Message>
            }

            {domainData ?
                <Message info style={{marginBottom: "50px"}}>
                    <Message.Header><h2>{domainData.name}</h2></Message.Header>
                    <Message info>
                        <Message.List style={{marginBottom: "10px"}}>
                            <Message.Item><b>Owner:</b> {domainData.owner}</Message.Item>
                            <Message.Item>Registered
                                on <b>{domainData.chainRegistered}</b> blockchain</Message.Item>
                        </Message.List>
                    </Message>

                    <Message.Header style={{margin: "20px auto"}}>Domain image:</Message.Header>
                    <Message info>
                        <Card.Group>
                            <Card>
                                <Image
                                    src={domainData?.image}
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <a href={`https://opensea.io/assets/${domainData?.chainRegistered ==="Ethereum" ? "ethereum" : "matic" }/${domainData?.contract}/${domainData?.tokenId}`} target={"_blank"}>
                                        <Button fluid>
                                            View on Opensea
                                        </Button>
                                    </a>
                                </Card.Content>
                            </Card>

                            <Card>
                                <Card.Content>
                                    <Card.Header>Token ID:</Card.Header>
                                    <Card.Meta> {domainData?.tokenId.slice(0, 8)}...{domainData?.tokenId.slice(-8)}</Card.Meta>
                                    <br/>
                                    <Card.Header>Attributes:</Card.Header>
                                    {
                                        domainData?.attributes?.length
                                        ? domainData.attributes.map((attribute) => {
                                            return <Button style={{marginTop: "10px", marginRight: "10px"}} as='div' labelPosition='right'>
                                                <Button icon>
                                                    {attribute.trait_type}
                                                </Button>
                                                <Label as='a' basic pointing='left'>
                                                    {attribute.value}
                                                </Label>
                                            </Button>
                                            })
                                        : ""
                                    }
                                </Card.Content>
                            </Card>
                        </Card.Group>
                    </Message>

                    <Message.Header style={{marginTop: "30px", marginBottom: "10px"}}>Setted blockchain
                        addresses:</Message.Header>
                    {
                        !domainData.properties.records["crypto.ETH.address"] &&
                        !domainData.properties.records["crypto.BTC.address"] &&
                        !domainData.properties.records["crypto.ADA.address"]
                            ? <Message info>No setted addresses</Message>
                            : <Card.Group>
                                {domainData.properties.records["crypto.ETH.address"] &&
                                    <AddressCard
                                        image={EthLogo}
                                        chainName={"Ethereum"}
                                        chainSymbol={"ETH"}
                                        address={domainData.properties.records["crypto.ETH.address"]}>
                                    </AddressCard>
                                }
                                {domainData.properties.records["crypto.BTC.address"] &&
                                    <AddressCard
                                        image={BtcLogo}
                                        chainName={"Bitcoin"}
                                        chainSymbol={"BTC"}
                                        address={domainData.properties.records["crypto.BTC.address"]}>
                                    </AddressCard>
                                }
                                {domainData.properties.records["crypto.ADA.address"] &&
                                    <AddressCard
                                        image={AdaLogo}
                                        chainName={"Cardano"}
                                        chainSymbol={"ADA"}
                                        address={domainData.properties.records["crypto.ADA.address"]}>
                                    </AddressCard>
                                }
                            </Card.Group>
                    }
                </Message>
                : ""
            }
        </div>
    );
}
