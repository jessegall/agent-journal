<?php

declare(strict_types=1);

namespace Tests\Wire\Installation;

use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Projects\Enums\ArrangementType;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The local host script's check of the enrolled host, run as the script runs it through tinker: known for a host the
 * database holds, gone for one it does not.
 */
#[OverTheWire]
final class HostKnownScriptTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_check_says_known_for_a_held_host_and_gone_for_another(): void
    {
        $enroll = new EnrollHostCommand('local', [base_path()], ArrangementType::Contained);
        $enrolled = $this->journal->asSystem($enroll);

        $this->assertSame(
            ['known', 'gone'],
            [$this->check($enrolled->hostId), $this->check('01nosuchhost00000000000000')],
        );
    }

    private function check(string $hostId): string
    {
        $template = (string) file_get_contents(base_path('scripts/local-host/host-known.php'));
        $script = str_replace('{{host}}', $hostId, $template);
        Artisan::call('tinker', ['--execute' => $script]);

        return trim(Artisan::output());
    }
}
