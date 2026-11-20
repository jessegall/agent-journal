<?php

declare(strict_types=1);

namespace Tests\Unit\Numbers;

use App\Numbers\Exceptions\InvalidRecordReference;
use App\Numbers\Support\RecordReference;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * One parser reads every number people type, and a reference reads back as people say it.
 */
final class RecordReferenceTest extends TestCase
{
    public function test_a_reference_reads_and_labels_as_people_say_it(): void
    {
        $plan = RecordReference::parse('plan 12');

        $this->assertSame(['plan', 12], [$plan->type, $plan->number]);
        $this->assertSame('plan 12', $plan->label());
        $this->assertSame('plan 12, phase 2', RecordReference::within($plan, 'phase', 2)->label());
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function invalidNumbers(): iterable
    {
        yield 'zero' => ['0'];

        yield 'negative' => ['-1'];

        yield 'exponent' => ['1e3'];

        yield 'leading zero' => ['012'];

        yield 'space' => [' 12'];

        yield 'past the bigint range' => ['9223372036854775808'];
    }

    #[DataProvider('invalidNumbers')]
    public function test_a_number_people_could_mistype_is_refused_by_name(string $text): void
    {
        $this->expectException(InvalidRecordReference::class);

        RecordReference::number($text);
    }
}
