import type { ComparisonRow } from './types';

export const comparisonRows: ComparisonRow[] = [
  {
    criterion: 'Rechtsnatur',
    foundation:
      'Rechtsfähige Stiftung bürgerlichen Rechts. Sie entsteht durch Stiftungsgeschäft und Anerkennung der zuständigen Landesbehörde.',
    structure:
      'Ein Trust nach dem Recht seiner Errichtung und eine Limited Liability Company nach dem Wyoming Limited Liability Company Act. Beides sind keine deutschen Rechtsformen.',
  },
  {
    criterion: 'Vermögen',
    foundation:
      'Das gewidmete Vermögen ist vom Privatvermögen der stiftenden Person getrennt und an den Stiftungszweck gebunden.',
    structure:
      'Die LLC kann Vermögenswerte halten. Die Mitgliedschaft kann einem Trust zugeordnet sein, dessen Urkunde die Regeln für die Familie trägt.',
  },
  {
    criterion: 'Steuerung',
    foundation: 'Satzung, Vorstand als Pflichtorgan und weitere Organe, soweit die Satzung sie vorsieht.',
    structure:
      'Trust Deed, Trustee und häufig ein Protector. Daneben Operating Agreement und Manager der LLC. Eigentum und Geschäftsführung lassen sich trennen.',
  },
  {
    criterion: 'Aufsicht',
    foundation: 'Stiftungsaufsicht der zuständigen Behörde des Sitzlandes.',
    structure:
      'Keine deutsche Stiftungsaufsicht. Maßgeblich sind das Trust-Recht und das Gesellschaftsrecht von Wyoming, dazu die Pflichten gegenüber Banken und Behörden.',
  },
  {
    criterion: 'Familie',
    foundation:
      'Begünstigte (Destinatäre) folgen aus der Satzung. Sie sind nicht Gesellschafter und haben kein Eigentum am Stiftungsvermögen.',
    structure:
      'Begünstigte folgen aus dem Trust Deed. Der Vermögensstock muss nicht im Wege der gesetzlichen Erbfolge auf einzelne Personen übergehen.',
  },
  {
    criterion: 'Änderungen',
    foundation: 'Zweck und Verfassung sind gesetzlich eng gebunden. Eine Stiftung ist auf Dauer angelegt.',
    structure:
      'Was sich ändern lässt, steht im Trust Deed und im anwendbaren Recht. Das ist nicht pauschal flexibler oder starrer als eine Satzung.',
  },
  {
    criterion: 'Öffentlichkeit',
    foundation:
      'Welche Angaben zu Satzung und Organen zugänglich sind, hängt vom Sitzland ab. Eine Stiftung ist kein anonymes Gebilde.',
    structure:
      'Die öffentliche Gründungsurkunde einer Wyoming-LLC muss die Gesellschafter nicht namentlich nennen. Das ist Registervertraulichkeit, keine Unsichtbarkeit gegenüber Banken, Gerichten oder Finanzbehörden.',
  },
  {
    criterion: 'Laufende Kosten',
    foundation:
      'Gründung, ausreichendes Vermögen, Verwaltung und Umgang mit der Aufsicht. Eine Pauschale nennt diese Website nicht.',
    structure:
      'Staatliche Jahresgebühr der LLC ab dem gesetzlichen Mindestbetrag von 60 US-Dollar, dazu Registered Agent, Trustee und Beratung. Weitere Beträge sind individuell.',
  },
  {
    criterion: 'Steuern',
    foundation:
      'Immer individuell. Bei Familienstiftungen ist unter anderem die Erbersatzsteuer zu prüfen. Diese Website rechnet nichts vor.',
    structure:
      'Immer individuell. Ein ausländischer Trust und eine US-Gesellschaft beenden keine Steuerpflicht im Wohnsitzstaat. Eine Entlastung wird nicht versprochen.',
  },
  {
    criterion: 'Wann sie passt',
    foundation:
      'Wenn deutsches Stiftungsrecht, staatliche Aufsicht und ein auf Dauer gewidmeter Zweck gewollt sind.',
    structure:
      'Wenn Vermögensschutz, Nachfolge, Zusammenhalt und Governance in einem Trust und einer US-LLC abgebildet werden sollen und die Fachleute der Familie das tragen.',
  },
];
