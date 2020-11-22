import {React, useHistory, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import API from '../../util/API';
// import CharacterTile from '../../components/CharacterTile';
import CharacterAdd from '../../components/CharacterAdd';
import {useAuth} from '../../util/authContext';
import Calendar from '../../components/Calendar';

function CampaignPage() {
  const {campaignId} = useParams();
  const history = useHistory();
  const {user} = useAuth();

  const [campaign, setCampaign] = useState({});
  const [campaignCharacters, setCampaignCharacters] = useState([]);
  const [userCharacters, setUserCharacters] = useState([]);

  useEffect(() => {
    let characterIdArray;
    let campaignObject;

    API.getOneCampaign(campaignId)
      .then((results) => {
        campaignObject = results.data;
        characterIdArray = results.data.characters;
      })
      .then(() => {
        let arrayCounter = 0;
        let newArray = [];
        characterIdArray.forEach((characterId) => {
          API.getOneCharacter(characterId).then((results) => {
            newArray.push(results.data);
            arrayCounter++;
            if (arrayCounter === characterIdArray.length) {
              setCampaignCharacters(newArray);
              setCampaign(campaignObject);
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    API.getCharacters(user)
      .then((results) => {
        setUserCharacters(results.data.characters);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const characterPageClick = (event) => {
    event.preventDefault();
    console.log(event.target.id);
    const id = event.target.id;
    history.push('/character/' + id);
  };

  const sessionClick = (event, sessionId) => {
    history.push('/session/' + sessionId);
  };

  const [showCharacterAddModal, setShowCharacterAddModall] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState('');

  const showCharacterAddModalClick = (event) => {
    event.preventDefault();
    setShowCharacterAddModall(true);
  };

  const handleClose = () => {
    setShowCharacterAddModall(false);
  };

  const handleCharacterAddSubmit = (event) => {
    event.preventDefault();
    API.addCharacterToCampaignArray(campaignId, selectedCharacterId).then(
      (res) => {
        setShowCharacterAddModall(false);
      }
    );
  };

  const handleInputChangeCharacterAdd = (event) => {
    const theSelectedCharacterID = event.target.value;
    setSelectedCharacterId(theSelectedCharacterID);
  };

  return (
    <main className="container">
      <h3 className="mt-3 mb-4 text-center">{campaign.name}</h3>
      <div className="col" style={{contentHeight: '100'}}>
        <Calendar campaignId={campaignId} sessionClick={sessionClick} />
      </div>
      <span
        className="block"
        style={{
          display: 'block',
          margin: 'auto',
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '1rem',
          borderBlock: '#2C3E50',
          backgroundColor: '#2C3E50',
          color: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center',
        }}
      >
        Click on the calendar to create an event
      </span>
      <div className="row mt-2">
        <div className="col-md-6 overflow-auto border" style={{height: '15em'}}>
          <p className="mt-2"></p>
          {campaign.description}
        </div>
        <div className="col-md-6 overflow-auto border" style={{height: '15em'}}>
          <CharacterAdd
            campaignCharacters={campaignCharacters}
            userCharacters={userCharacters}
            show={showCharacterAddModal}
            showModalFunction={showCharacterAddModalClick}
            handleClose={handleClose}
            handleCharacterAddSubmit={handleCharacterAddSubmit}
            handleInputChangeCharacterAdd={handleInputChangeCharacterAdd}
            onClick={characterPageClick}
          />
        </div>
      </div>
    </main>
  );
}
export default CampaignPage;
