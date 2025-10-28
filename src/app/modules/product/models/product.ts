export class Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
  constructor(
    id: string,
    name: string,
    description: string,
    logo: string,
    date_release: string,
    date_revision: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.logo = logo;
    this.date_release = date_release;
    this.date_revision = date_revision;
  }
}
