<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Core is laid out by subject: a project-own class sits in app/<Subject>/<Type>, so no app-level
 * type folder keeps a subject folder the subject also holds, and commands live only in their subject's Commands folder.
 * Laravel's own folders are not judged here.
 */
final class SubjectLayoutTest extends TestCase
{
    /**
     * @return array<string, array{string}>
     */
    public static function kinds(): array
    {
        return [
            'contracts' => ['Contracts'],
            'enums' => ['Enums'],
            'data' => ['Data'],
            'values' => ['Values'],
            'exceptions' => ['Exceptions'],
            'pipes' => ['Pipes'],
            'support' => ['Support'],
        ];
    }

    #[DataProvider('kinds')]
    public function test_no_subject_is_split_between_its_folder_and_a_kind_folder(string $kind): void
    {
        $split = array_values(array_filter(
            array_map(basename(...), glob(app_path("{$kind}/*"), GLOB_ONLYDIR) ?: []),
            fn (string $subject) => is_dir(app_path("{$subject}/{$kind}")),
        ));

        $this->assertSame([], $split, "Move these into app/<Subject>/{$kind}, where the rest of their subject sits.");
    }

    public function test_commands_live_only_in_their_subjects_commands_folder(): void
    {
        $this->assertDirectoryDoesNotExist(app_path('Commands'));
    }
}
