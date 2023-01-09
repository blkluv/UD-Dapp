import Resolution from "@unstoppabledomains/resolution";
import {ethers} from "ethers";

const getTokenURI = (tokenId, setError, setLoading, setDomainData) => {
    (async ()=>{
        setLoading(true)
        try {
            const ethereumProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth")
            const polygonProvider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")

            const proxyReaderAddressEthereum = "0x58034A288D2E56B661c9056A0C27273E5460B63c";
            const proxyReaderAddressPolygon = "0x423F2531bd5d3C3D4EF7C318c2D1d9BEDE67c680";

            const contractNftEthereum = "0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe";
            const contractNftPolygon = "0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f";

            const proxyReaderAbi = [
                "function tokenURI(uint256 tokenId) external view returns (string memory)",
                "function exists(uint256 tokenId) external view returns (bool)",
                "function ownerOf(uint256 tokenId) external view returns (address)",
            ];

            const proxyReaderContractEthereum = new ethers.Contract(
                proxyReaderAddressEthereum,
                proxyReaderAbi,
                ethereumProvider
            );
            const proxyReaderContractPolygon = new ethers.Contract(
                proxyReaderAddressPolygon,
                proxyReaderAbi,
                polygonProvider
            );

            const existsEthereum = await proxyReaderContractEthereum.exists(tokenId);
            const existsPolygon = await proxyReaderContractPolygon.exists(tokenId);

            if(!existsEthereum && !existsPolygon){
                setError("Domain is not registered on Ethereum or Polygon !")
            }
            else {
                let contract;
                let contractAddress;
                if (existsEthereum){
                    contract = proxyReaderContractEthereum;
                    contractAddress = contractNftEthereum;
                }
                else if (existsPolygon) {
                    contract = proxyReaderContractPolygon;
                    contractAddress = contractNftPolygon;
                }

                const tokenURI = await contract.tokenURI(tokenId);
                const owner = await contract.ownerOf(tokenId);

                let response = await fetch(tokenURI);
                let result = await response.json();
                if(!result?.name) throw new Error("No domain data...")

                setDomainData({...result,
                    chainRegistered: existsEthereum ? "Ethereum" : "Polygon",
                    owner: owner,
                    contract: contractAddress
                })
            }
        } catch (e){
            console.log(e)
            setError(e.message)
        }
        setLoading(false)
    })();
}

export const search = (e, domain, setLoading, setError, setDomainData) => {
    e.preventDefault();
    setDomainData(null)
    setLoading(true)
    setError(false)
    try {
        if (!domain) {
            setLoading(false)
            setError("Enter a domain")
            return
        }
        const resolution = new Resolution();
        const namehash = resolution.namehash(domain, "UNS");
        getTokenURI(namehash, setError, setLoading, setDomainData);
    } catch (e){
        setError(e.message)
        setLoading(false)
    }
}