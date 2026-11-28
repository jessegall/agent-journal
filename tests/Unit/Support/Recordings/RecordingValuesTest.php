<?php

declare(strict_types=1);

namespace Tests\Unit\Support\Recordings;

use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\Recordings;
use Tests\Support\Recordings\Exceptions\LiveValueRefused;
use Tests\Support\Recordings\RecordingValues;
use Tests\TestCase;

/**
 * The fakes of a real recording bind to the live values heard in their places, by shape.
 */
final class RecordingValuesTest extends TestCase
{
    /**
     * An instruction id as the journal makes them, standing where the recording holds its fake.
     */
    private const string LIVE_INSTRUCTION_ID = '01m8e43aw61nwtv446cw9v0cty';

    public function test_a_fake_id_is_bound_to_the_first_live_id_and_replaced_thereafter(): void
    {
        $claim = $this->recordedClaim();
        $recorded = (array) json_decode($claim->body, true);
        $fake = (string) $recorded['instructions'][0]['id'];
        $heard = (array) json_decode(str_replace($fake, self::LIVE_INSTRUCTION_ID, $claim->body), true);
        $values = new RecordingValues();

        $values->hear('claim', $recorded, $heard);

        $this->assertSame('{"id":"'.self::LIVE_INSTRUCTION_ID.'"}', $values->live('{"id":"'.$fake.'"}'));
    }

    public function test_an_empty_live_path_is_refused_naming_its_place(): void
    {
        $this->expectExceptionObject(LiveValueRefused::empty('claim.path', $this->recordedClaim()->path));

        new RecordingValues()->hear('claim', ['path' => $this->recordedClaim()->path], ['path' => '']);
    }

    public function test_an_address_of_another_shape_is_refused(): void
    {
        $path = $this->recordedClaim()->path;

        $this->expectException(LiveValueRefused::class);

        new RecordingValues()->hear('claim', ['path' => $path], ['path' => "http://journal.test{$path}"]);
    }

    public function test_a_live_value_one_fake_stands_for_is_refused_to_another(): void
    {
        [$first, $second] = $this->recordedOutputPaths();
        $values = new RecordingValues();
        $values->hear('host', ['path' => $first], ['path' => $first]);

        // The refusal names the live part that the other fake already stands for, as the Go twin does.
        $process = explode('/', $first)[3];
        $this->expectExceptionObject(LiveValueRefused::standsFor('host.path', $process, $process));

        $values->hear('host', ['path' => $second], ['path' => $first]);
    }

    public function test_a_fake_inside_a_longer_fake_is_not_replaced(): void
    {
        [$first] = $this->recordedOutputPaths();
        $process = explode('/', $first)[3];
        $digest = 'sha256:'.str_repeat('0', 64 - strlen($process) - 1).$process.'0';
        $values = new RecordingValues();
        $values->hear('host', $process, self::LIVE_INSTRUCTION_ID);

        $this->assertSame($digest, $values->live($digest));
    }

    /**
     * The paths of two recorded processes' output calls of the Claude Code terminal turn, each naming its own process.
     *
     * @return list<string>
     */
    private function recordedOutputPaths(): array
    {
        $calls = $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn')->calls(Wire::Host);
        $paths = array_values(array_unique(array_map(
            fn (RecordedCall $call) => $call->path,
            array_filter($calls, fn (RecordedCall $call) => str_ends_with($call->path, '/output')),
        )));

        return array_slice($paths, 0, 2);
    }

    private function recordedClaim(): RecordedCall
    {
        $calls = $this->app->make(Recordings::class)->scenario('host', 'folders')->calls(Wire::Host);

        return array_values(array_filter(
            $calls,
            fn (RecordedCall $call) => $call->status !== null && $call->path === '/host/instructions/claim',
        ))[0];
    }
}
