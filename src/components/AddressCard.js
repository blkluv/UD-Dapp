import {Button, Card, Icon, Image} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default function AddressCard(props) {
    return (
        <Card>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src={props.image}
                    style={{width: "40px", height: "40px"}}
                />
                <Card.Header>{props.chainName}</Card.Header>
                <Card.Meta>{props.chainSymbol}</Card.Meta>
                <Card.Description>
                    {props.address.slice(0, 10)}
                    ...
                    {props.address.slice(-10)}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button
                        icon
                        labelPosition='right'
                        onClick={() => {navigator.clipboard.writeText(props.address)}}
                    >
                        <Icon name='copy' />
                        Copy
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}