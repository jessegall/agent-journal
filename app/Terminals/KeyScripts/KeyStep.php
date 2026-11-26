<?php

declare(strict_types=1);

namespace App\Terminals\KeyScripts;

use App\Terminals\Screens\Enums\KeyAction;
use App\Terminals\Screens\MenuEntries;

/**
 * One step of a key script: the screen it waits for, within its deadline, and the one action it then takes. An entry
 * step finds its entry by the value of its parameter, by the note it carries, or by a fixed label.
 */
final readonly class KeyStep
{
    /**
     * How long a step waits for its screen: the recorded screens follow their key within five seconds.
     */
    public const int DEADLINE_MS = 5000;

    private function __construct(
        public string $name,
        public ScreenExpectation $expectation,
        public KeyAction $action,
        public string $keys = '',
        public string|null $parameter = null,
        public string|null $label = null,
        public string|null $note = null,
    ) {}

    public static function press(string $name, ScreenExpectation $expectation, string $keys): self
    {
        return new self($name, $expectation, KeyAction::PressKeys, $keys);
    }

    /**
     * A step that moves the menu's highlight onto the entry the parameter's value names.
     */
    public static function find(string $name, string $family, string $parameter): self
    {
        return new self($name, ScreenExpectation::menu($family), KeyAction::SelectEntry, parameter: $parameter);
    }

    /**
     * A step that moves the menu's highlight onto the one entry carrying the note, such as "(current)".
     */
    public static function findMarked(string $name, string $family, string $note): self
    {
        return new self($name, ScreenExpectation::menu($family), KeyAction::SelectEntry, note: $note);
    }

    /**
     * A step that moves the highlight onto the entry with the label, checks it is there, and only then presses Enter.
     */
    public static function choose(string $family, string $label): self
    {
        $expectation = ScreenExpectation::menu($family);

        return new self("choose {$label} in {$family}", $expectation, KeyAction::ChooseEntry, label: $label);
    }

    /**
     * A step of a navigation round: the main agent's entry chosen by its label on whatever still screen is drawn.
     */
    public static function chooseOnScreen(string $label): self
    {
        return new self("choose {$label}", ScreenExpectation::still(), KeyAction::ChooseEntry, label: $label);
    }

    /**
     * A step of a navigation round: Enter on the entry the main agent saw highlighted, refused once it is not.
     */
    public static function confirmOnScreen(string $label): self
    {
        return new self("confirm {$label}", ScreenExpectation::still(), KeyAction::ConfirmEntry, label: $label);
    }

    /**
     * A step of a library entry: on the screen with its recorded fingerprint, its label chosen or its named key
     * pressed.
     */
    public static function ofEntry(int $index, string $fingerprint, string|null $label, string $keys): self
    {
        $expectation = ScreenExpectation::fingerprinted($fingerprint);

        if ($label !== null) {
            return new self("entry step {$index}", $expectation, KeyAction::ChooseEntry, label: $label);
        }

        return new self("entry step {$index}", $expectation, KeyAction::PressKeys, $keys);
    }

    /**
     * A last step that sends nothing and waits for the driver's own words that the change applied.
     */
    public static function evidence(string $name, string ...$words): self
    {
        return new self($name, ScreenExpectation::shows(...$words), KeyAction::WaitForScreen);
    }

    /**
     * The text with each parameter named in braces replaced by the run's value.
     *
     * @param  array<string, string>  $values
     */
    public static function filled(string $text, array $values): string
    {
        $names = array_map(fn (string $name) => '{'.$name.'}', array_keys($values));

        return str_replace($names, array_values($values), $text);
    }

    /**
     * The entries the step looks for among those shown: one is the entry, none or two leave it uncertain.
     *
     * @param  array<string, string>  $values
     * @return list<int>
     */
    public function targetsIn(MenuEntries $entries, array $values): array
    {
        if ($this->note !== null) {
            return $entries->indicesMarked($this->note);
        }

        return $entries->indicesOf($this->parameter === null ? (string) $this->label : $values[$this->parameter]);
    }
}
