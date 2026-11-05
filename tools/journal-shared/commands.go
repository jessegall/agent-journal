package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/jessegall/agent-journal/tools/journal-shared/store"
)

// newFlags makes the flags every command has: --data, the folder holding shared.db.
func newFlags(name string, errs io.Writer) (*flag.FlagSet, *string) {
	flags := flag.NewFlagSet(name, flag.ContinueOnError)
	flags.SetOutput(errs)
	return flags, flags.String("data", "", "the folder holding shared.db")
}

// parse reads flags and the given number of plain arguments in any order, as in `user add Ada --role admin`.
func parse(flags *flag.FlagSet, arguments []string, wanted int) ([]string, error) {
	var positional []string
	for len(arguments) > 0 {
		if err := flags.Parse(arguments); err != nil {
			return nil, err
		}
		arguments = flags.Args()
		if len(arguments) > 0 {
			positional = append(positional, arguments[0])
			arguments = arguments[1:]
		}
	}
	if len(positional) != wanted {
		return nil, fmt.Errorf("%s takes %d argument(s) besides its flags, got %d", flags.Name(), wanted, len(positional))
	}
	return positional, nil
}

func openData(folder string) (*store.Store, error) {
	if folder == "" {
		return nil, errors.New("--data <folder> is required")
	}
	return store.Open(folder)
}

func userCommand(name string, arguments []string, output, errs io.Writer) error {
	flags, data := newFlags("user "+name, errs)
	role := flags.String("role", "", "admin, edit or read")
	var wanted int
	switch name {
	case "add", "remove", "tokens":
		wanted = 1
	case "role":
		wanted = 2
	default:
		return fmt.Errorf("there is no user command %q", name)
	}
	positional, err := parse(flags, arguments, wanted)
	if err != nil {
		return err
	}
	database, err := openData(*data)
	if err != nil {
		return err
	}
	defer database.Close()
	switch name {
	case "add":
		return addUser(database, positional[0], *role, output)
	case "role":
		return changeRole(database, positional[0], positional[1], output)
	case "remove":
		return removeUser(database, positional[0], output)
	}
	return listTokens(database, positional[0], output)
}

func addUser(database *store.Store, name, roleName string, output io.Writer) error {
	role, err := store.ParseRole(roleName)
	if err != nil {
		return err
	}
	user, err := database.AddUser(name, role)
	if err != nil {
		return err
	}
	return printNewToken(database, user, "", output)
}

func changeRole(database *store.Store, name, roleName string, output io.Writer) error {
	role, err := store.ParseRole(roleName)
	if err != nil {
		return err
	}
	user, err := database.UserByName(name)
	if err != nil {
		return err
	}
	user, err = database.SetRole(user.ID, role)
	if err == nil {
		fmt.Fprintf(output, "user %s is now %s\n", user.Name, user.Role)
	}
	return err
}

func removeUser(database *store.Store, name string, output io.Writer) error {
	user, err := database.UserByName(name)
	if err != nil {
		return err
	}
	if _, err = database.RemoveUser(user.ID); err == nil {
		fmt.Fprintf(output, "user %s removed, and every token of theirs revoked\n", user.Name)
	}
	return err
}

func listTokens(database *store.Store, name string, output io.Writer) error {
	user, err := database.UserByName(name)
	if err != nil {
		return err
	}
	tokens, err := database.Tokens(user.ID)
	for _, token := range tokens {
		state := "last used " + token.LastUsedAt
		if token.LastUsedAt == "" {
			state = "never used"
		}
		if token.RevokedAt != "" {
			state = "revoked " + token.RevokedAt
		}
		fmt.Fprintf(output, "token %d  %q  made %s  %s\n", token.ID, token.Label, token.CreatedAt, state)
	}
	return err
}

func tokenCommand(name string, arguments []string, output, errs io.Writer) error {
	flags, data := newFlags("token "+name, errs)
	label := flags.String("label", "", "what the token is for, such as a laptop")
	if name != "new" && name != "revoke" {
		return fmt.Errorf("there is no token command %q", name)
	}
	positional, err := parse(flags, arguments, 1)
	if err != nil {
		return err
	}
	database, err := openData(*data)
	if err != nil {
		return err
	}
	defer database.Close()
	if name == "revoke" {
		return revokeToken(database, positional[0], output)
	}
	user, err := database.UserByName(positional[0])
	if err != nil {
		return err
	}
	return printNewToken(database, user, *label, output)
}

func revokeToken(database *store.Store, number string, output io.Writer) error {
	id, err := strconv.ParseInt(number, 10, 64)
	if err != nil {
		return fmt.Errorf("%q is not a token number", number)
	}
	if _, err = database.RevokeToken(id); err == nil {
		fmt.Fprintf(output, "token %d revoked\n", id)
	}
	return err
}

func printNewToken(database *store.Store, user store.User, label string, output io.Writer) error {
	text, token, err := database.NewToken(user.ID, label)
	if err != nil {
		return err
	}
	fmt.Fprintf(output, "user %s (%s), token %d\n%s\nthis token is shown once and is kept nowhere\n", user.Name, user.Role, token.ID, text)
	return nil
}

func itemCommand(name string, arguments []string, output, errs io.Writer) error {
	flags, data := newFlags("item "+name, errs)
	if name != "history" && name != "purge" {
		return fmt.Errorf("there is no item command %q", name)
	}
	positional, err := parse(flags, arguments, 2)
	if err != nil {
		return err
	}
	kind, matched := store.KindByName(positional[0])
	if !matched {
		return fmt.Errorf("there is no kind %q; the kinds are %s", positional[0], strings.Join(store.KindNames(), ", "))
	}
	id, err := strconv.ParseInt(positional[1], 10, 64)
	if err != nil {
		return fmt.Errorf("%q is not an item number", positional[1])
	}
	database, err := openData(*data)
	if err != nil {
		return err
	}
	defer database.Close()
	if name == "purge" {
		return purgeItem(database, kind, id, output)
	}
	return printHistory(database, kind, id, output)
}

func printHistory(database *store.Store, kind store.ItemType, id int64, output io.Writer) error {
	versions, err := database.ItemVersions(kind, id)
	for _, version := range versions {
		fmt.Fprintf(output, "version %d  %s  by %s with token %q  at %s\n", version.Version, version.Action, version.User, version.Token, version.CreatedAt)
	}
	return err
}

// purgeItem is written in the name of the first admin, because the purge row needs a user and this command is run by
// whoever has the server's data folder.
func purgeItem(database *store.Store, kind store.ItemType, id int64, output io.Writer) error {
	admin, err := database.FirstAdmin()
	if err != nil {
		return errors.New("a purge is written in the name of the first admin, and there is none: user add makes one")
	}
	deleted, err := database.PurgeItem(kind, id, store.Caller{User: admin})
	if err == nil {
		fmt.Fprintf(output, "%s %d purged with its %d versions; its number is never used again\n", kind.Name, id, deleted)
	}
	return err
}

func backupCommand(arguments []string, output, errs io.Writer) error {
	flags, data := newFlags("backup", errs)
	positional, err := parse(flags, arguments, 1)
	if err != nil {
		return err
	}
	database, err := openData(*data)
	if err != nil {
		return err
	}
	defer database.Close()
	if err := database.Backup(positional[0]); err != nil {
		return err
	}
	fmt.Fprintf(output, "backup written to %s\n", positional[0])
	return nil
}
