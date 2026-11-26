<?php

declare(strict_types=1);

namespace Tests\Unit\Records;

use App\Records\Exceptions\RecordProviderInvalid;
use App\Records\RecordSummaries;
use App\Support\Reflector;
use Illuminate\Container\Container;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Modules\Notes\NoteRecords;
use Tests\Fixtures\Modules\Notes\Support\NoteSummaries;

/**
 * The registry of record summaries: a registered type is covered and its provider made when asked, a type nobody
 * registered is not covered and refused, and a class that summarizes nothing or a type registered twice is refused.
 */
final class SummaryProvidersTest extends TestCase
{
    private const string TYPE = 'notes.note';

    public function test_a_registered_type_is_covered_and_gives_its_provider(): void
    {
        $summaries = new RecordSummaries(new Container(), Reflector::factory());

        $summaries->register(self::TYPE, NoteSummaries::class);

        $this->assertTrue($summaries->covers(self::TYPE));
        $this->assertSame([self::TYPE], $summaries->types());
        $this->assertInstanceOf(NoteSummaries::class, $summaries->providerOf(self::TYPE));
    }

    public function test_a_type_nobody_registered_is_not_covered_and_has_no_provider(): void
    {
        $summaries = new RecordSummaries(new Container(), Reflector::factory());

        $this->assertFalse($summaries->covers(self::TYPE));
        $this->expectExceptionObject(RecordProviderInvalid::unknown(self::TYPE));

        $summaries->providerOf(self::TYPE);
    }

    public function test_a_class_that_summarizes_nothing_is_refused(): void
    {
        $this->expectExceptionObject(RecordProviderInvalid::notAProvider(self::TYPE, NoteRecords::class));

        new RecordSummaries(new Container(), Reflector::factory())->register(self::TYPE, NoteRecords::class);
    }

    public function test_a_type_registered_twice_is_refused(): void
    {
        $summaries = new RecordSummaries(new Container(), Reflector::factory());
        $summaries->register(self::TYPE, NoteSummaries::class);

        $this->expectExceptionObject(RecordProviderInvalid::repeated(self::TYPE));

        $summaries->register(self::TYPE, NoteSummaries::class);
    }
}
