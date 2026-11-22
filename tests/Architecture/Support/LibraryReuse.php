<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Symfony\Component\Finder\Finder;

/**
 * The places a Vue template outside the kit draws a control of its own where the library has one: a raw form or
 * dialog element, or a role the kit's components already carry (user message 15814, doc 105).
 */
final readonly class LibraryReuse
{
    /**
     * Each raw element and the library component to use in its place.
     */
    public const array ELEMENTS = [
        'button' => 'Button or IconButton',
        'input' => 'Input or Field',
        'textarea' => 'Textarea',
        'select' => 'ListBox or SegmentedControl',
        'dialog' => 'Dialog',
    ];

    /**
     * Each role and the library component that already carries it.
     */
    public const array ROLES = [
        'dialog' => 'Dialog',
        'menu' => 'Menu',
        'menuitem' => 'MenuItem',
        'tab' => 'Tabs',
        'tablist' => 'Tabs',
        'listbox' => 'ListBox',
        'option' => 'ListBox',
        'switch' => 'Toggle',
        'radiogroup' => 'SegmentedControl',
        'radio' => 'SegmentedControl',
        'tooltip' => 'Tooltip',
        'meter' => 'Meter',
    ];

    /**
     * Folders whose files are the library itself or generated, never judged.
     */
    private const array SKIPPED = ['/components/kit/', '/generated/', '/actions/', '/routes/'];

    /**
     * Every offending element under the folders, as `path:element` keyed by `path:line:element`, paths from the root.
     *
     * @param  list<string>  $folders
     * @return array<string, string>
     */
    public static function in(string $root, array $folders): array
    {
        $found = [];

        foreach ($folders as $folder) {
            if (! is_dir($folder)) {
                continue;
            }

            foreach (Finder::create()->files()->in($folder)->name('*.vue') as $file) {
                $path = substr($file->getRealPath(), strlen(rtrim($root, '/')) + 1);

                if (self::isSkipped($path)) {
                    continue;
                }

                $found += self::offendersIn($path, (string) file_get_contents($file->getRealPath()));
            }
        }

        ksort($found);

        return $found;
    }

    /**
     * The component the library offers in place of an offending `element` or `role=name`.
     */
    public static function componentFor(string $element): string
    {
        if (str_starts_with($element, 'role=')) {
            return self::ROLES[substr($element, 5)];
        }

        return self::ELEMENTS[$element];
    }

    /**
     * @return array<string, string>
     */
    private static function offendersIn(string $path, string $source): array
    {
        $template = self::templateOf($source);
        $found = [];
        $elements = '/<('.implode('|', array_keys(self::ELEMENTS)).')(?=[\s>\/])/';
        $roles = '/\brole="('.implode('|', array_keys(self::ROLES)).')"/';

        foreach (explode("\n", $template['text']) as $index => $line) {
            $number = $template['firstLine'] + $index;

            preg_match_all($elements, $line, $elementMatches);
            preg_match_all($roles, $line, $roleMatches);

            foreach ($elementMatches[1] as $element) {
                $found["{$path}:{$number}:{$element}"] = "{$path}:{$element}";
            }

            foreach ($roleMatches[1] as $role) {
                $found["{$path}:{$number}:role={$role}"] = "{$path}:role={$role}";
            }
        }

        return $found;
    }

    /**
     * The file's outer template and the line it starts on; a file without one has no template text.
     *
     * @return array{text: string, firstLine: int}
     */
    private static function templateOf(string $source): array
    {
        $start = strpos($source, '<template');
        $end = strrpos($source, '</template>');

        if ($start === false || $end === false) {
            return ['text' => '', 'firstLine' => 1];
        }

        return [
            'text' => substr($source, $start, $end - $start),
            'firstLine' => substr_count(substr($source, 0, $start), "\n") + 1,
        ];
    }

    private static function isSkipped(string $path): bool
    {
        foreach (self::SKIPPED as $folder) {
            if (str_contains("/{$path}", $folder)) {
                return true;
            }
        }

        return false;
    }
}
