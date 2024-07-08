import InOurTeam from './InOurTeam'
import AvailableChracters from './AvailableChracters'

const Chacracters = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <AvailableChracters />
            </div>
            <div style={{ flex: 2 }}>
                <InOurTeam />
            </div>
        </div>
    )
}

export default Chacracters
