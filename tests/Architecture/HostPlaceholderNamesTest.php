<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Hosts\HostProtocol;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\HostPlaceholderScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The journal writes into a plan only the {host:NAME} names the host fills, as protocol/host.json lists them; a name
 * the host does not know is refused by the host as unsafe, so it fails here first.
 */
#[TimeLimit(seconds: 20, reason: 'It parses every PHP file of the app and the domains.')]
final class HostPlaceholderNamesTest extends TestCase
{
    public function test_every_host_name_the_journal_writes_is_one_the_protocol_names(): void
    {
        $unknown = [];

        foreach (ScanCache::findingsInFolders(new HostPlaceholderScan(), [app_path(), ...DomainFiles::domainCode()]) as $path => $names) {
            foreach ($names as $found) {
                if (! in_array($found['name'], HostProtocol::HOST_NAMES, true)) {
                    $unknown[] = substr($path, strlen(base_path()) + 1).":{$found['line']} {host:{$found['name']}}";
                }
            }
        }

        $this->assertSame([], $unknown, "Not a host name of protocol/host.json:\n".implode("\n", $unknown));
    }
}
