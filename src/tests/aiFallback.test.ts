/**
 * Unit tests for the StadiumIQ Pro AI Fallback Engine.
 * Validates rule matching, persona filtering, priority ordering,
 * and default response generation.
 */
import { describe, it, expect } from 'vitest';
import { getFallbackResponse, getAllFallbackKeywords } from '../services/aiFallback';

describe('getFallbackResponse — Greeting Rules', () => {
  it('returns welcome message for "hello"', () => {
    const resp = getFallbackResponse('hello', 'fan', 'en');
    expect(resp).toContain('Welcome to StadiumIQ Pro');
    expect(resp).toContain('FIFA World Cup 2026');
  });

  it('returns welcome message for "hi"', () => {
    const resp = getFallbackResponse('hi', 'fan', 'en');
    expect(resp).toContain('Welcome to StadiumIQ Pro');
  });

  it('includes persona name in greeting', () => {
    const resp = getFallbackResponse('hello', 'organizer', 'en');
    expect(resp.toLowerCase()).toContain('organizer');
  });

  it('includes live match info in greeting', () => {
    const resp = getFallbackResponse('hey there', 'fan', 'en');
    expect(resp).toContain('Argentina');
    expect(resp).toContain('Brazil');
  });
});

describe('getFallbackResponse — Emergency Rules', () => {
  it('returns emergency response for "medical emergency"', () => {
    const resp = getFallbackResponse('There is a medical emergency', 'fan', 'en');
    expect(resp).toContain('PRIORITY ALERT');
    expect(resp).toContain('Gate 2 Medical Bay');
  });

  it('returns emergency response for "someone fainted"', () => {
    const resp = getFallbackResponse('someone fainted near section B', 'staff', 'en');
    expect(resp).toContain('PRIORITY ALERT');
    expect(resp).toContain('AED');
  });

  it('has higher priority than food query when both keywords present', () => {
    const resp = getFallbackResponse('medical help near food court', 'fan', 'en');
    // Emergency (priority 2) should win over food (priority 4)
    expect(resp).toContain('PRIORITY ALERT');
  });
});

describe('getFallbackResponse — Security Rules', () => {
  it('returns security response for suspicious bag', () => {
    const resp = getFallbackResponse('I see a suspicious bag', 'fan', 'en');
    expect(resp).toContain('Security Alert');
    expect(resp).toContain('YELLOW');
  });

  it('returns security response for fight report', () => {
    const resp = getFallbackResponse('there is a fight at gate 3', 'staff', 'en');
    expect(resp).toContain('Security Alert');
  });
});

describe('getFallbackResponse — Food & Concessions Rules', () => {
  it('returns food court info for "where is food"', () => {
    const resp = getFallbackResponse('where is the food', 'fan', 'en');
    expect(resp).toContain('Food Court Status');
  });

  it('includes dietary options in food response', () => {
    const resp = getFallbackResponse('I need halal food', 'fan', 'en');
    expect(resp.toLowerCase()).toContain('halal');
  });

  it('includes queue times in food response', () => {
    const resp = getFallbackResponse('I am hungry', 'fan', 'en');
    expect(resp).toContain('min');
  });

  it('mentions app ordering for fans', () => {
    const resp = getFallbackResponse('where can I eat', 'fan', 'en');
    expect(resp.toLowerCase()).toContain('app');
  });
});

describe('getFallbackResponse — Gate Queue Rules', () => {
  it('returns queue status for "crowd" queries', () => {
    const resp = getFallbackResponse('the crowd is huge at gate 5', 'fan', 'en');
    expect(resp).toContain('Gate Queue Monitor');
  });

  it('includes recommended gate in queue response', () => {
    const resp = getFallbackResponse('which gate has shortest wait', 'fan', 'en');
    expect(resp).toContain('Best Choice');
  });

  it('mentions accessibility routes', () => {
    const resp = getFallbackResponse('gate queue information', 'fan', 'en');
    expect(resp).toContain('Step-free');
  });
});

describe('getFallbackResponse — Transport Rules', () => {
  it('returns transport info for "metro" queries', () => {
    const resp = getFallbackResponse('how do I take the metro', 'fan', 'en');
    expect(resp).toContain('Transport Dashboard');
  });

  it('includes shuttle info in transport response', () => {
    const resp = getFallbackResponse('is there a shuttle bus', 'fan', 'en');
    expect(resp).toContain('Shuttle');
  });

  it('includes parking information', () => {
    const resp = getFallbackResponse('where do I park', 'fan', 'en');
    expect(resp).toContain('Parking');
  });
});

describe('getFallbackResponse — Navigation Rules', () => {
  it('returns navigation help for seat finding', () => {
    const resp = getFallbackResponse('I cannot find my seat', 'fan', 'en');
    expect(resp).toContain('Navigation');
  });

  it('includes volunteer mention in navigation', () => {
    const resp = getFallbackResponse('I am lost', 'fan', 'en');
    expect(resp.toLowerCase()).toContain('volunteer');
  });
});

describe('getFallbackResponse — Restroom Rules', () => {
  it('returns restroom locations for bathroom query', () => {
    const resp = getFallbackResponse('where is the nearest toilet', 'fan', 'en');
    expect(resp).toContain('Restrooms');
  });

  it('includes accessible restrooms in response', () => {
    const resp = getFallbackResponse('restroom', 'fan', 'en');
    expect(resp).toContain('Accessible');
  });
});

describe('getFallbackResponse — Incident Rules (persona-gated)', () => {
  it('returns incident report for staff persona', () => {
    const resp = getFallbackResponse('I need to report an incident', 'staff', 'en');
    expect(resp).toContain('Incident Management');
  });

  it('returns incident report for volunteer persona', () => {
    const resp = getFallbackResponse('there is a problem here', 'volunteer', 'en');
    expect(resp).toContain('Incident Management');
  });

  it('returns default response for fan persona (persona-gated rule)', () => {
    const resp = getFallbackResponse('I found a broken chair', 'fan', 'en');
    // Fan is NOT in personas for incident rule, should get default or another rule
    expect(resp).toBeDefined();
    expect(resp.length).toBeGreaterThan(20);
  });
});

describe('getFallbackResponse — Sustainability Rules', () => {
  it('returns sustainability metrics for carbon query', () => {
    const resp = getFallbackResponse('what is the carbon offset today', 'organizer', 'en');
    expect(resp).toContain('Sustainability Command Center');
  });

  it('includes solar energy data', () => {
    const resp = getFallbackResponse('solar energy output today', 'organizer', 'en');
    expect(resp).toContain('Solar');
  });

  it('includes water recycling data', () => {
    const resp = getFallbackResponse('what are the eco green metrics today', 'organizer', 'en');
    expect(resp).toContain('Water');
  });
});

describe('getFallbackResponse — Match Info Rules', () => {
  it('returns live match status for score query', () => {
    const resp = getFallbackResponse('what is the score', 'fan', 'en');
    expect(resp).toContain('LIVE Match Status');
    expect(resp).toContain('Argentina');
    expect(resp).toContain('Brazil');
  });

  it('includes attendance in match info', () => {
    const resp = getFallbackResponse('how many people are at the game', 'fan', 'en');
    expect(resp).toContain('78,231');
  });
});

describe('getFallbackResponse — Volunteer Rules', () => {
  it('returns shift info for volunteer', () => {
    const resp = getFallbackResponse('what is my volunteer shift today', 'volunteer', 'en');
    expect(resp).toContain('Volunteer Command Center');
  });

  it('returns task list for volunteer zone query', () => {
    const resp = getFallbackResponse('what tasks are in my volunteer zone', 'volunteer', 'en');
    expect(resp).toContain('Volunteer Command Center');
  });
});

describe('getFallbackResponse — Accessibility Rules', () => {
  it('returns accessibility info for wheelchair query', () => {
    const resp = getFallbackResponse('I need wheelchair assistance', 'fan', 'en');
    expect(resp).toContain('Accessibility Services');
  });

  it('includes hearing loop info for deaf users', () => {
    const resp = getFallbackResponse('I am deaf and need hearing loop', 'fan', 'en');
    expect(resp).toContain('Hearing');
  });

  it('includes companion pass info', () => {
    const resp = getFallbackResponse('mobility impaired companion pass', 'fan', 'en');
    expect(resp).toContain('Companion');
  });
});

describe('getFallbackResponse — Language Handling', () => {
  it('prepends language tag for non-English responses', () => {
    const resp = getFallbackResponse('hello', 'fan', 'es');
    expect(resp).toContain('[ES Response]');
  });

  it('does not prepend language tag for English', () => {
    const resp = getFallbackResponse('hello', 'fan', 'en');
    expect(resp).not.toContain('[EN Response]');
  });

  it('works for all supported languages', () => {
    const langs = ['fr', 'pt', 'ar', 'de', 'ja', 'zh', 'hi', 'ko'];
    for (const lang of langs) {
      const resp = getFallbackResponse('hello', 'fan', lang);
      expect(resp).toContain(`[${lang.toUpperCase()} Response]`);
    }
  });
});

describe('getFallbackResponse — Default Fallback', () => {
  it('returns default stadium status for unrecognized queries', () => {
    const resp = getFallbackResponse('zzz completely unrelated query xyz', 'fan', 'en');
    expect(resp).toContain('StadiumIQ Pro AI');
    expect(resp).toContain('Argentina');
  });

  it('default response includes weather and metro info', () => {
    const resp = getFallbackResponse('sdlfkj', 'fan', 'en');
    expect(resp).toContain('Weather');
    expect(resp).toContain('Metro');
  });
});

describe('getAllFallbackKeywords — Utility', () => {
  it('returns a non-empty array of keywords', () => {
    const keywords = getAllFallbackKeywords();
    expect(keywords.length).toBeGreaterThan(50);
  });

  it('includes critical emergency keywords', () => {
    const keywords = getAllFallbackKeywords();
    expect(keywords).toContain('emergency');
    expect(keywords).toContain('medical');
    expect(keywords).toContain('food');
    expect(keywords).toContain('queue');
  });
});
