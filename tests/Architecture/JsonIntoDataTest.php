<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Reflection\Support\Reflector;
use Spatie\LaravelData\Data;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\JsonDecodeScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Decoded JSON is read into a Data class, so its shape is written down and read through typed properties: every
 * json_decode in app/ and the domains is handed straight to a Data class's from(), collect() or validateAndCreate()
 * (user messages 10999, 11389). The Files area decodes for readJson and is left out, and only the methods listed
 * in ANY_JSON_METHODS may decode JSON of no fixed shape under #[DecodesAnyJson].
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app/ and the domains.')]
final class JsonIntoDataTest extends TestCase
{
    private const string HOW_TO_FIX = "These json_decode calls read JSON as a loose array; "
        ."hand the result straight to a Data class's from():\n";

    private const array TAKERS = ['from', 'collect', 'validateAndCreate'];

    /**
     * The only methods allowed #[DecodesAnyJson], each because its JSON has no shape of ours to name: a value of any
     * type kept as stored, a tool's own JSON line, a user's option or file sent on for the journal to check, a tree
     * checked node by node against its limits, a bare list of texts, or a map keyed by the operator's own environment
     * names whose entries each go into their own Data class.
     */
    private const array ANY_JSON_METHODS = [
        'App\\Settings\\Storage\\EncodedValue::jsonSerialize',
        'App\\Settings\\Casts\\SettingsDocumentCast::get',
        'App\\Processes\\Support\\DeclarativeReader::lineOf',
        'App\\AgentRequests\\Console\\Concerns\\RunsCallPipelines::jsonOption',
        'App\\Profiles\\Console\\ImportProfileDraftCommand::readCommands',
        'App\\Skills\\Support\\ConditionTree::fromJson',
        'App\\Profiles\\Casts\\ProfileAuthorizationCast::deniedCommandsOf',
        'App\\Agents\\Support\\WorkspaceSources::fromJson',
    ];

    public function test_every_decoded_json_goes_straight_into_a_data_class(): void
    {
        $folders = [app_path(), ...DomainFiles::domainCode()];
        $loose = [];

        foreach (ScanCache::findingsInFolders(new JsonDecodeScan(), $folders) as $path => $decodes) {
            $relative = substr($path, strlen(base_path()) + 1);

            if (str_starts_with($relative, 'app/Files/')) {
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
