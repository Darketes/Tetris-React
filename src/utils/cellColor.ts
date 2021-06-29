export const cellColor = (object: any) => {
  let color;
  switch (object) {
    case 1: {
      color = 'cyan';
      break;
    }
    case 2: {
      color = 'blue';
      break;
    }
    case 3: {
      color = 'chocolate';
      break;
    }
    case 4: {
      color = 'gold';
      break;
    }
    case 5: {
      color = 'chartreuse';
      break;
    }
    case 6: {
      color = 'blueviolet';
      break;
    }
    case 7: {
      color = 'red';
      break;
    }

    default:
      break;
  }
  return color;
};
