<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Events\Event;
use App\Contracts\Events\Listener;
use App\Support\Reflector;
use PhpOption\None;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every class in an Events folder of Core, a domain or an installed module implements Core's Event marker, so what
 * happens is recognisable as an event; every class in a Listeners folder implements Listener and
 * every handler beside its command implements CommandHandler, and neither marker is used outside
 * its
 * folder.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class EventMarkerTest extends TestCase
{
    /**
     * @return iterable<string, array{string, class-string}>
     */
    public static function markedFolders(): iterable
    {
        yield 'events' => ['#/Events/#', Event::class];

        yield 'listeners' => ['#/Listeners/#', Listener::class];

        yield 'handlers' => ['#/Commands/(\w+|Support)/\w+Handler\.php$#', CommandHandler::class];
    }

    /**
     * @param  class-string  $marker
     */
    #[DataProvider('markedFolders')]
    public function test_every_class_of_a_marked_folder_implements_its_marker_and_only_there(
        string $folder,
        string $marker,
    ): void {
        $unmarked = [];
        $misplaced = [];

        foreach (DomainFiles::in(
            [app_path(), ...DomainFiles::domainCode(), base_path('tests/Fixtures/Modules')],
        ) as $file) {
            $class = self::classIn($file);

            $type = $class === null ? None::create() : Reflector::find($class);

            if ($type->filter(fn (Reflector $found) => ! $found->isInterface())->isEmpty()) {
                continue;
            }

            $inFolder = preg_match($folder, $file) === 1;
            $marked = $class !== null && Reflector::factory()->isSubclassOf($class, $marker);

            if ($inFolder && ! $marked) {
                $unmarked[] = $class;
            }

            if (! $inFolder && $marked && $marker !== Event::class) {
                $misplaced[] = $class;
            }
        }

        $this->assertSame([[], []], [$unmarked, $misplaced]);
    }

    private static function classIn(string $file): string|null
    {
        $source = (string) file_get_contents($file);

        if (preg_match('/^namespace ([^;]+);/m', $source, $namespace) !== 1 || preg_match(
            '/^(?:final |abstract )?(?:readonly )?(?:class|interface|enum) (\\w+)/m',
            $source,
            $name,
        ) !== 1) {
            return null;
        }

        return $namespace[1].'\\'.$name[1];
    }
}
