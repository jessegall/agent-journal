<?php

declare(strict_types=1);

namespace Tests\Unit\Numbers;

use App\Support\RecordReference;
use App\Web\Exceptions\InvalidRecordReference;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * One parser reads every number users type, and a reference reads back as users say it.
 */
final class RecordReferenceTest extends TestCase
{
    private const string PLAN_LABEL = 'plan 12';

    private const string PHASE_LABEL = 'plan 12, phase 2';

    public function test_a_reference_reads_and_labels_as_users_say_it(): void
    {
        $plan = RecordReference::parse(self::PLAN_LABEL);

        $this->assertSame(['plan', 12], [$plan->type, $plan->number]);
        $this->assertSame(self::PLAN_LABEL, $plan->label());
        $this->assertSame(self::PHASE_LABEL, RecordReference::within($plan, 'phase', 2)->label());
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
    public function test_a_number_users_could_mistype_is_refused_by_name(string $text): void
    {
        $this->expectException(InvalidRecordReference::class);

        RecordReference::number($text);
    }
}
