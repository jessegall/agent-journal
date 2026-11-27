<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Console\Support\PintFormatter;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Hosts\Data\HostProtocolData;
use App\Values\FilePath;

/**
 * Compares the files the host protocol generator writes with what protocol/host.json makes of them now, so a change
 * made to the file and not generated, or made to a generated file by hand, is found.
 */
final readonly class HostProtocolCheck
{
    public function __construct(private Files $files, private PintFormatter $pint) {}

    /**
     * Each generated file's path from the project root, with its source as the protocol file makes it now.
     *
     * @return array<string, string>
     */
    public function sources(): array
    {
        $protocolFile = FilePath::in(Place::Project, HostProtocolSources::PROTOCOL_FILE);

        return new HostProtocolSources(HostProtocolData::from($this->files->readJson($protocolFile)))->sources();
    }

    /**
     * The generated files that differ from what the protocol file makes of them, or are missing, under the folder of
     * the place: the project itself by default.
     *
     * @return list<string>
     */
    public function drifted(Place $place = Place::Project, string $folder = ''): array
    {
        $drifted = [];
        $sources = $this->sources();
        $isPhp = fn (string $relative) => str_ends_with($relative, '.php');

        $expected = [
            ...$sources,
            ...$this->pint->formattedAll(array_filter($sources, $isPhp, ARRAY_FILTER_USE_KEY)),
        ];

        foreach ($expected as $relative => $source) {
            $target = FilePath::in($place, ltrim("{$folder}/{$relative}", '/'));

            if (! $this->files->exists($target) || $source !== $this->files->read($target)) {
                $drifted[] = $relative;
            }
        }

        return $drifted;
    }
}
