package recording

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"regexp"
	"sort"
	"strings"
)

// ErrValueRefused is returned when a live value cannot stand where its recording held a fake: it is empty, of
// another shape, or another value than the one the fake is already bound to.
var ErrValueRefused = errors.New("the live value cannot stand for the recorded one")

// A fake's shape is the shape of the real value the recording replaced, as the PHP RecordingFakes makes them.
var (
	uuidShape   = regexp.MustCompile(`[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`)
	ulidShape   = regexp.MustCompile(`0[0-7][0-9a-hjkmnp-tv-z]{24}`)
	digestShape = regexp.MustCompile(`[0-9a-f]{64}`)
)

// fakeShapes are the fakes a recording holds, each by the prefix the PHP RecordingFakes gives it and its shape.
var fakeShapes = []struct {
	fake  *regexp.Regexp
	shape *regexp.Regexp
}{
	{regexp.MustCompile(`00000000-0000-4000-8000-[0-9a-f]{12}`), uuidShape},
	{regexp.MustCompile(`00000000000000[0-9a-hjkmnp-tv-z]{12}`), ulidShape},
	{regexp.MustCompile(`0000000000000000[0-9a-f]{48}`), digestShape},
}

// Place is where a value was heard: the exchange, the event's number in it and the field's path in the event.
type Place struct {
	Exchange string
	Event    int
	Field    string
}

func (place Place) String() string {
	return fmt.Sprintf("exchange %s, event %d, field %s", place.Exchange, place.Event, place.Field)
}

// Values binds each fake of a recording to the live value first heard in its place, and puts the live values in
// place of the fakes in what the recording answers. It is given nothing but what it hears: a value a test holds for
// a container's own environment never binds a fake.
type Values struct {
	bound map[string]string
}

// NewValues are values with no fake bound yet.
func NewValues() *Values {
	return &Values{bound: map[string]string{}}
}

// Copy is a copy of the bindings, to try binding a heard value without changing these.
func (values *Values) Copy() *Values {
	bound := make(map[string]string, len(values.bound))
	for fake, live := range values.bound {
		bound[fake] = live
	}
	return &Values{bound: bound}
}

// Hear binds the fakes of the recorded JSON to the live values the heard JSON holds in the same places, refusing an
// empty live value, one of another shape than the recorded one, and one that differs from a fake's earlier binding.
func (values *Values) Hear(place Place, recorded, heard []byte) error {
	var was, is any
	if err := json.Unmarshal(recorded, &was); err != nil {
		return fmt.Errorf("reading the recorded value at %s: %w", place, err)
	}
	if err := json.Unmarshal(heard, &is); err != nil {
		return fmt.Errorf("reading the heard value at %s: %w", place, err)
	}
	return values.pair(place, was, is)
}

// Live is the recorded text with each bound fake replaced by its live value; a fake never heard stays.
func (values *Values) Live(recorded string) string {
	for fake, live := range values.bound {
		recorded = strings.ReplaceAll(recorded, fake, live)
	}
	return recorded
}

func (values *Values) pair(place Place, was, is any) error {
	switch recorded := was.(type) {
	case string:
		heard, _ := is.(string)
		return values.bind(place, recorded, heard)
	case map[string]any:
		heard, _ := is.(map[string]any)
		for key, value := range recorded {
			if err := values.pair(place.Within(key), value, heard[key]); err != nil {
				return err
			}
		}
	case []any:
		heard, _ := is.([]any)
		for index, value := range recorded {
			var item any
			if index < len(heard) {
				item = heard[index]
			}
			if err := values.pair(place.Within(fmt.Sprint(index)), value, item); err != nil {
				return err
			}
		}
	}
	return nil
}

// bind binds each fake of one recorded string to the live text at its place, once the heard string has the shape of
// the recorded one: a URL where a URL was recorded, a path where a path was.
func (values *Values) bind(place Place, recorded, heard string) error {
	if !isAddress(recorded) && !holdsFake(recorded) {
		return nil
	}
	if heard == "" {
		return fmt.Errorf("%w: %s is empty where the recording held %q", ErrValueRefused, place, recorded)
	}
	if isURL(recorded) != isURL(heard) || isPath(recorded) != isPath(heard) {
		return fmt.Errorf("%w: %s is %q where the recording held %q", ErrValueRefused, place, heard, recorded)
	}
	fakes, pattern := fakesOf(recorded)
	live := pattern.FindStringSubmatch(heard)
	if live == nil {
		return fmt.Errorf("%w: %s is %q, not of the shape of %q", ErrValueRefused, place, heard, recorded)
	}
	for index, fake := range fakes {
		if earlier, isBound := values.bound[fake]; isBound && earlier != live[index+1] {
			return fmt.Errorf("%w: %s is %q where %s is already %q", ErrValueRefused, place, live[index+1], fake, earlier)
		}
		values.bound[fake] = live[index+1]
	}
	return nil
}

// fakesOf are the fakes of a recorded string in the order they stand, and a pattern that matches a live string of
// its shape with one group in place of each fake.
func fakesOf(recorded string) ([]string, *regexp.Regexp) {
	type found struct {
		start, end int
		shape      *regexp.Regexp
	}
	all := []found{}
	for _, shape := range fakeShapes {
		for _, at := range shape.fake.FindAllStringIndex(recorded, -1) {
			all = append(all, found{at[0], at[1], shape.shape})
		}
	}
	// The earliest fake wins, the longest of those starting together; a fake inside one already taken is part of it.
	sort.Slice(all, func(left, right int) bool {
		if all[left].start != all[right].start {
			return all[left].start < all[right].start
		}
		return all[left].end > all[right].end
	})
	fakes, pattern, from := []string{}, "^", 0
	for _, fake := range all {
		if fake.start < from {
			continue
		}
		fakes = append(fakes, recorded[fake.start:fake.end])
		pattern += regexp.QuoteMeta(recorded[from:fake.start]) + "(" + fake.shape.String() + ")"
		from = fake.end
	}
	return fakes, regexp.MustCompile(pattern + regexp.QuoteMeta(recorded[from:]) + "$")
}

func holdsFake(text string) bool {
	for _, shape := range fakeShapes {
		if shape.fake.MatchString(text) {
			return true
		}
	}
	return false
}

func isAddress(text string) bool {
	return isURL(text) || isPath(text)
}

func isURL(text string) bool {
	address, err := url.Parse(text)
	return err == nil && address.Scheme != "" && address.Host != ""
}

func isPath(text string) bool {
	return strings.HasPrefix(text, "/")
}

// Within is the place of the field of that name inside this one.
func (place Place) Within(key string) Place {
	place.Field = strings.TrimPrefix(place.Field+"."+key, ".")
	return place
}
