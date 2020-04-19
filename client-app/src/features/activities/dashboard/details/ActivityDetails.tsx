import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { IActivity } from "../../../../app/models/Activity";

interface IProps {
  activity: IActivity;
  setEditMode: (editMode:boolean) => void;
  setSelectedActivity: (activity:IActivity | null) => void;
}

const Activitydetatils: React.FC<IProps> = ({activity, setEditMode, setSelectedActivity}) => {
  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button basic color='blue' content='Edit' onClick={() => setEditMode(true)}/>
          <Button basic color='grey' content='Cancel' onClick={() => setSelectedActivity(null)}/>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default Activitydetatils;
