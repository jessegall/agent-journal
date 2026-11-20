<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\UserWords;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Rule 46: code and its texts call the person using the journal the user, never a human or a person.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every line of the code it judges.')]
final class UserWordTest extends TestCase
{
    public function test_a_line_saying_person_is_found_and_one_saying_user_and_personal_passes(): void
    {
        $this->assertSame(
            [
                base_path('tests/Fixtures/UserWords/SaysPerson.php').':10',
                base_path('tests/Fixtures/UserWords/SaysPerson.php').':8',
            ],
            UserWords::in([base_path('tests/Fixtures/UserWords')]),
        );
    }

    public function test_no_code_calls_the_user_a_human_or_a_person(): void
    {
        $folders = [
            app_path(),
            ...DomainFiles::domainCode(),
            base_path('tools/journal-agent'),
            resource_path('js'),
            ...(glob(base_path('domain/*/resources/js'), GLOB_ONLYDIR) ?: []),
        ];

        $this->assertSame([], UserWords::in($folders));
    }
}
