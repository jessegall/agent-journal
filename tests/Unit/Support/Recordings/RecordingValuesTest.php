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

    private function recordedClaim(): RecordedCall
    {
        $calls = $this->app->make(Recordings::class)->scenario('host', 'folders')->calls(Wire::Host);

        return array_values(array_filter(
            $calls,
            fn (RecordedCall $call) => $call->status !== null && $call->path === '/host/instructions/claim',
        ))[0];
    }
}
