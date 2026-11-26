# Renaming members

`tools/refactoring/rename-member.php` renames a class member and its references, or a variable within a folder, file or
function.

- A static method is renamed at every static call that resolves to its class or a class extending it, by the class the
  call names or by self, static and parent inside one of them, however many other classes share its name.
- Any other member is renamed in the class, in every project class, interface and trait it is related to by extends,
  implements or use (an override keeps its parent's name), and at every call, access, constant fetch and named
  argument.
- When another unrelated project class declares a member of the same name, an instance call or access is renamed only
  when its receiver's type resolves to the family (`$this`, a typed property, parameter or return, a `new` or a
  container make), left alone when it resolves elsewhere, and listed for checking by hand when it cannot be resolved;
  `--with=App\\Other\\Class` renames the other class's member as well.
- A variable is renamed wherever it is used in the PHP files under the folder or file, including closure uses and
  `@param` lines. A line selects the parameter of the function, method or closure there.
- Strings that spell the old name are listed for checking by hand, never changed.
- A list file holds one rename per line in the same words; blank lines and `#` lines are skipped.
