<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hosts\Commands\ForwardUserKeys\ForwardUserKeysCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\CodeReferenceScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\TestCase;

/**
 * A driver's screens are passed only by the journal's screen navigation. Keys of the journal go to a driver
 * only from the key scripts, the screens and the terminal driver, through the host channel; a user's keys only from
 * the terminal driver carrying out a browser writer's input. No other code creates either command.
 */
final class ScreenNavigationTest extends TestCase
{
    /**
     * The folders and files that may create each key command, relative to the project.
     */
    private const array SENDERS = [
        SendHostKeysCommand::class => [
            'app/Support/KeyScripts/',
            'app/Support/Screens/',
            'app/Agents/Drivers/Processes/TerminalDriver.php',
            'app/Hosts/HostChannel.php',
        ],
        ForwardUserKeysCommand::class => [
            'app/Agents/Drivers/Processes/TerminalDriver.php',
            'app/Hosts/HostChannel.php',
        ],
    ];

    public function test_keys_go_to_a_driver_only_from_the_screen_navigation_and_the_terminal_driver(): void
    {
        $this->journal->assertResult([], $this->sendersOutside(self::SENDERS));
    }

    public function test_a_file_creating_keys_outside_its_allowed_places_is_named(): void
    {
        $narrowed = [SendHostKeysCommand::class => ['app/Support/KeyScripts/']];

        $this->journal->assertResult(
            true,
            in_array('app/Hosts/HostChannel.php', $this->sendersOutside($narrowed), true),
        );
    }

    /**
     * Each file that creates one of the commands outside the places allowed for it.
     *
     * @param  array<class-string, list<string>>  $senders
     * @return list<string>
     */
    private function sendersOutside(array $senders): array
    {
        $root = base_path().'/';
        $outside = [];
        $files = DomainFiles::in([$root.'app', ...DomainFiles::domainCode()]);

        foreach (ScanCache::findingsByFile(new CodeReferenceScan(), $files) as $path => $findings) {
            $relative = substr($path, strlen($root));

            foreach ($senders as $command => $allowed) {
                $creates = in_array(CodeReferenceScan::CREATES.$command, $findings, true);
                $isAllowed = array_any($allowed, fn (string $place) => str_starts_with($relative, $place));

                if ($creates && ! $isAllowed) {
                    $outside[] = $relative;
                }
            }
        }

        return array_values(array_unique($outside));
    }
}
