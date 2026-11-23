<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\WordLines;
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
            WordLines::in(WordLines::USER_WORDS, [base_path('tests/Fixtures/UserWords')]),
        );
    }

    // User message 19692: the word kept coming back in tests, tools, documents and designs, which the scan of the
    // code alone never read. Every file the project writes is read now.
    public function test_nothing_in_the_project_calls_the_user_a_human_or_a_person(): void
    {
        $this->assertSame([], WordLines::inProject(WordLines::USER_WORDS));
    }
}
