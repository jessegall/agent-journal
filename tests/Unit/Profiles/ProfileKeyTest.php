<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Profiles\Exceptions\ProfileKeyInvalid;
use App\Profiles\Values\ProfileKey;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class ProfileKeyTest extends TestCase
{
    public function test_a_lowercase_hyphenated_key_is_kept_as_written(): void
    {
        $this->assertSame('journal-reviewer', ProfileKey::from('journal-reviewer')->key);
        $this->assertSame('a', ProfileKey::from('a')->key);
        $this->assertSame(str_repeat('a', 64), ProfileKey::from(str_repeat('a', 64))->key);
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function invalidKeys(): iterable
    {
        yield 'empty' => [''];
        yield 'too long' => [str_repeat('a', 65)];
        yield 'uppercase' => ['Journal-reviewer'];
        yield 'leading hyphen' => ['-journal'];
        yield 'trailing hyphen' => ['journal-'];
        yield 'double hyphen' => ['journal--reviewer'];
        yield 'underscore' => ['journal_reviewer'];
        yield 'space' => ['journal reviewer'];
        yield 'not ascii' => ['journal-révieweur'];
        yield 'trailing newline' => ["journal\n"];
    }

    #[DataProvider('invalidKeys')]
    public function test_a_key_outside_the_pattern_is_refused_by_name(string $text): void
    {
        $this->expectException(ProfileKeyInvalid::class);

        ProfileKey::from($text);
    }
}
