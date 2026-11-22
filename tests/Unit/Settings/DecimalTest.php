<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Exceptions\DecimalInvalid;
use App\Values\Decimal;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * A decimal keeps its exact text and compares through brick/math, never through a float.
 */
final class DecimalTest extends TestCase
{
    public function test_plain_text_keeps_its_digits(): void
    {
        $this->assertSame('0.10', Decimal::parse('0.10')->text);
        $this->assertSame('0.00', Decimal::parse('-0.00')->text);
        $this->assertSame('7.5', Decimal::parse('007.5')->text);
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function notPlain(): iterable
    {
        yield 'an exponent' => ['1e3'];

        yield 'a plus' => ['+1'];

        yield 'a space' => [' 1'];

        yield 'a word' => ['NAN'];

        yield 'a point without digits' => ['1.'];

        yield 'nothing' => [''];
    }

    #[DataProvider('notPlain')]
    public function test_text_that_is_not_plain_is_refused(string $text): void
    {
        $this->expectException(DecimalInvalid::class);

        Decimal::parse($text);
    }

    public function test_equal_numbers_compare_equal_whatever_their_digits(): void
    {
        $this->assertTrue(Decimal::parse('0.1')->isEqualTo(Decimal::parse('0.10')));
        $this->assertTrue(Decimal::parse('0.2')->isGreaterThan(Decimal::parse('0.10')));
        $this->assertSame(-1, Decimal::parse('-1')->compareTo(Decimal::parse('0')));
    }

    public function test_a_scale_pads_but_never_rounds(): void
    {
        $this->assertSame('1.50', Decimal::parse('1.5')->toScale(2)->text);
        $this->assertSame(3, Decimal::parse('1.50')->precision());

        $this->expectException(DecimalInvalid::class);

        Decimal::parse('1.555')->toScale(2);
    }
}
