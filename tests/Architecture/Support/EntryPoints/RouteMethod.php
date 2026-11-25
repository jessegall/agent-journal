<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use Illuminate\Routing\Route;
use Illuminate\Support\Str;

/**
 * One method of a named journal route, with the namespace of its owner, core's App or a domain's, and the file its
 * entry test is written in: a domain's route drops the domain's own first name segment, a core route takes its first
 * segment as the folder, and the rest of the name in StudlyCase is followed by the method.
 */
final readonly class RouteMethod
{
    public function __construct(public Route $route, public string $method, public string $owner) {}

    public function name(): string
    {
        return (string) $this->route->getName();
    }

    public function entryName(): string
    {
        return "{$this->method} {$this->name()}";
    }

    /**
     * The folder of the owner's route tests.
     */
    public function testFolder(): string
    {
        return EntryPoint::folderOf("{$this->owner}\\", EntryType::Route);
    }

    public function testFile(): string
    {
        $folder = $this->subfolder() === '' ? $this->testFolder() : "{$this->testFolder()}/{$this->subfolder()}";

        return "{$folder}/{$this->testClass()}.php";
    }

    public function testNamespace(): string
    {
        $base = $this->isDomains() ? "{$this->owner}\\Tests\\Routes" : 'Tests\\Routes';

        return $this->subfolder() === '' ? $base : "{$base}\\{$this->subfolder()}";
    }

    public function testClass(): string
    {
        $words = array_map(Str::studly(...), $this->nameWithinFolder());

        return implode('', $words).Str::studly(strtolower($this->method)).'Test';
    }

    public function isDomains(): bool
    {
        return str_starts_with($this->owner, 'Domain\\');
    }

    /**
     * A core route's folder under tests/Routes: its first name segment, when its name has more than one.
     */
    private function subfolder(): string
    {
        $segments = explode('.', $this->name());

        return $this->isDomains() || count($segments) === 1 ? '' : Str::studly($segments[0]);
    }

    /**
     * The name segments the class is named after: a domain's without its own first segment, a core one's without its
     * folder.
     *
     * @return list<string>
     */
    private function nameWithinFolder(): array
    {
        $segments = explode('.', $this->name());

        return count($segments) === 1 ? $segments : array_slice($segments, 1);
    }
}
