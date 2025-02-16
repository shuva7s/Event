export interface IEvent {
  id: string;
  host_id: string;
  title: string;
  description: string;
  image: null | string;
  online: boolean;
  public: boolean;
  location: string;
  start_date_time: string;
  end_date_time: string;
  created_at: string;
  updated_at: string;
}
