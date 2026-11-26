<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\Reflector;
use Spatie\LaravelData\Data;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\JsonDecodeScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Decoded JSON is read into a Data class, so its shape is written down: every json_decode in app/ and the domains goes
 * straight to a Data class's from(), collect() or validateAndCreate(). The Files area is left out, and only
 * ANY_JSON_METHODS may decode JSON of no fixed shape.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app/ and the domains.')]
final class JsonIntoDataTest extends TestCase
{
    private const string HOW_TO_FIX = 'These json_decode calls read JSON as a loose array; '
        ."hand the result straight to a Data class's from():\n";

    private const array TAKERS = [
        'from',
        'collect',
        'validateAndCreate',
    ];

    /**
     * The only methods allowed #[DecodesAnyJson], each because its JSON has no shape the journal names, such as a
     * stored value of any type, a tool's own JSON line, a driver's own state file or settings, or a page's layout as
     * the page wrote it.
     */
    private const array ANY_JSON_METHODS = [
        'App\\Settings\\Storage\\EncodedValue::jsonSerialize',
        'App\\Casts\\SettingsDocumentCast::get',
        'App\\Processes\\DeclarativeReader::lineOf',
        'App\\Console\\Concerns\\RunsApiPipelines::jsonOption',
        'App\\Console\\Commands\\ImportProfileDraftCommand::readCommands',
        'App\\Skills\\ConditionTree::fromJson',
        'App\\Hosts\\WorkspaceSources::fromJson',
        'App\\Agents\\Drivers\\ClaudeCode\\ClaudeFirstRun::__invoke',
        'App\\Agents\\Drivers\\ClaudeCode\\TurnResult::readLine',
        'App\\Agents\\Drivers\\Codex\\CodexAppDriver::readLine',
        'App\\Agents\\Drivers\\ClaudeCode\\ClaudeSettingsMerge::withProtection',
    ];

    public function test_every_decoded_json_goes_straight_into_a_data_class(): void
    {
        $folders = [app_path(), ...DomainFiles::domainCode()];
        $loose = [];

        foreach (ScanCache::findingsInFolders(new JsonDecodeScan(), $folders) as $path => $decodes) {
            $relative = substr($path, strlen(base_path()) + 1);

            // The Files area decodes a file as it reads it, behind the Files contract.
            if ($relative === 'app/Support/Files.php') {
                continue;
            }

            foreach ($decodes as $decode) {
                $isAllowedAnyJson = in_array($decode['marked'], self::ANY_JSON_METHODS, true);

                if (! $isAllowedAnyJson && ! self::goesIntoData($decode['class'], $decode['method'])) {
                    $loose[] = "{$relative}:{$decode['line']}";
                }
            }
        }

        $this->assertSame(
            [],
            $loose,
            self::HOW_TO_FIX.implode("\n", $loose),
        );
    }

    private static function goesIntoData(string|null $class, string|null $method): bool
    {
        return $class !== null
            && in_array($method, self::TAKERS, true)
            && Reflector::factory()->isSubclassOf($class, Data::class);
    }
}
