<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Support\Recordings\CutExchange;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\RecordedCall;
use App\Support\Recordings\RecordedEvent;
use App\Support\Recordings\RecordedOutputReport;
use App\Support\Recordings\RecordingFakes;
use App\Support\Recordings\RecordingOpening;
use Illuminate\Http\Request;
use Tests\TestCase;

/**
 * A host's output report keeps its printed bytes in base64, so the faker fakes them as bytes, the leak check reads
 * them, and a chunk faked to another length moves the later chunks of the same process by as much.
 */
final class RecordedOutputReportTest extends TestCase
{
    private const string PROCESS = '01m8gq1py7khsv5naz78sx65as';

    public function test_a_chunk_is_faked_as_the_bytes_it_carries(): void
    {
        $call = $this->outputReport(self::PROCESS, [[0, "  \"email\": \"someone@company.example\",\n"]]);

        $faked = RecordedOutputReport::askedBy($call->fakedBy(new RecordingFakes([], [])));

        $this->assertSame('  "email": "'.RecordingFakes::EMAIL."\",\n", $faked?->printed());
    }

    public function test_a_faked_chunk_moves_the_later_chunks_of_its_process_by_its_change_of_length(): void
    {
        $first = "  \"email\": \"someone@company.example\",\n";
        $second = "}\n";
        $exchange = new CutExchange(RecordingOpening::ofCalls(Wire::Host, 'host-caller'), [
            RecordedEvent::asked(1, $this->outputReport(self::PROCESS, [[0, $first]])),
            RecordedEvent::asked(2, $this->outputReport(self::PROCESS, [[strlen($first), $second]])),
        ], null);

        $faked = $exchange->fakedBy(new RecordingFakes([], []));

        $fakedFirst = '  "email": "'.RecordingFakes::EMAIL."\",\n";
        $this->assertSame(
            [[0], [strlen($fakedFirst)]],
            array_map(fn (RecordedEvent $event) => $this->offsetsOf((string) $event->call?->body), $faked->events),
        );
    }

    public function test_the_leak_check_reads_what_a_report_printed(): void
    {
        $exchange = new CutExchange(RecordingOpening::ofCalls(Wire::Host, 'host-caller'), [
            RecordedEvent::asked(1, $this->outputReport(self::PROCESS, [[0, 'someone@company.example']])),
        ], null);

        $this->assertStringContainsString('someone@company.example', $exchange->text());
    }

    /**
     * The host's report of the chunks the process printed, each at its offset.
     *
     * @param  list<array{int, string}>  $chunks
     */
    private function outputReport(string $processId, array $chunks): RecordedCall
    {
        $body = json_encode([
            'frames' => [],
            'chunks' => array_map(
                fn (array $chunk) => ['stream' => 'stdout', 'offset' => $chunk[0], 'bytes' => base64_encode($chunk[1])],
                $chunks,
            ),
        ]);

        return RecordedCall::askedBy(Request::create("/host/processes/{$processId}/output", 'POST', content: (string) $body));
    }

    /**
     * @return list<int>
     */
    private function offsetsOf(string $body): array
    {
        return array_map(fn (array $chunk) => (int) $chunk['offset'], (array) json_decode($body, true)['chunks']);
    }
}
