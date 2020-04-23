import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";
configure({enforceActions: 'always'})
class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = ''

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id,activity);
        });
        this.loadingInitial = false;
      })
      
    } catch (error) {
      console.log(error);
      runInAction('load activities error',() => this.loadingInitial = false);
    }
  };

  @action createActivity = async (activity:IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id,activity);
      this.editMode = false;
      this.submitting = false;
      })
      
    } catch (error) {
      console.log(error)
      runInAction('create activity',() => {this.submitting = false})
      
    }
  }

  @action editActivity = async (activity:IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id,activity);
        this.selectedActivity = activity;
        this.submitting = false;
        this.editMode = false;
      });
      
    } catch (error) {
      console.log(error)
      runInAction('edit activity', () => {
        this.submitting = false
        this.editMode = false;
      });
     
    }
  }

  @action deleteActivity = async (e:SyntheticEvent<HTMLButtonElement>, id:string) => {
    this.submitting = true;
    this.target = e.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
      
    } catch (error) {
      console.log(error);
      runInAction('delete activity',() => {
        this.submitting = false;
        this.target = '';
      })
      
    }
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }

  @action openEditForm = (id:String) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  }
}

export default createContext(new ActivityStore());
