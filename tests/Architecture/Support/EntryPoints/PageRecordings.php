<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Tests\Support\Agents\HostContract;

/**
 * The page requests the frontend tests recorded under tests/Contracts/page-requests, each matched to the route method
 * it calls, and the test of that route that must send it through RouteCall::recorded.
 */
final readonly class PageRecordings
{
    private const string FOLDER = 'tests/Contracts/page-requests';

    public function __construct(private string $root, private Router $router) {}

    /**
     * Each recording no test of its route loads, with the route test to load it in, or the route it matches none.
     *
     * @param  list<NamedEntry>  $named
     * @return list<string>
     */
    public function unloaded(array $named): array
    {
        $unloaded = [];

        foreach (glob("{$this->root}/".self::FOLDER.'/*.json') ?: [] as $path) {
            $recording = basename($path, '.json');
            $entry = $this->entryOf($recording);
            $files = array_values(array_unique(array_map(
                fn (NamedEntry $test) => $test->file,
                array_filter($named, fn (NamedEntry $test) => $test->type === EntryType::Route
                    && $test->name === $entry),
            )));
            $loads = "RouteCall::recorded('{$recording}'";
            $loaded = array_filter(
                $files,
                fn (string $file) => str_contains((string) file_get_contents("{$this->root}/{$file}"), $loads),
            );

            if ($loaded === []) {
                $unloaded[] = $this->gapOf($recording, $entry, $files);
            }
        }

        return $unloaded;
    }

    /**
     * The route method the recording calls, as a route test names it, or none when no named route matches it.
     */
    private function entryOf(string $recording): string|null
    {
        /** @var array{method: string, url: string} $request */
        $request = HostContract::of('page-requests/'.$recording.'.json')->readFor([]);
        $sent = Request::create($request['url'], $request['method']);
        $matching = array_filter(
            $this->router->getRoutes()->getRoutes(),
            fn (Route $route) => $route->getName() !== null && $route->matches($sent),
        );

        return $matching === [] ? null : "{$request['method']} ".array_values($matching)[0]->getName();
    }

    /**
     * @param  list<string>  $files
     */
    private function gapOf(string $recording, string|null $entry, array $files): string
    {
        return match (true) {
            $entry === null => "The recording {$recording} calls no named route: record it again or delete it.",
            $files === [] => "The recording {$recording} calls {$entry}, which no route test names.",
            default => implode(', ', $files)." does not load the recording {$recording}: send it with "
                ."RouteCall::recorded('{$recording}', [...]).",
        };
    }
}
