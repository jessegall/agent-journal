<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Declarations\RegisteredLoader;
use App\Support\ClientDeclarations;
use Illuminate\Support\Str;

/**
 * The browser's view of every declared loader: one descriptor each, named for its key, typed by its input and answer
 * Data, and the generated types those come from, by owner.
 */
final readonly class LoaderTypes
{
    public function __construct(private ClientDeclarations $declarations, private TypeOwners $owners) {}

    /**
     * The input and answer types to import, by the owner whose generated module holds them.
     *
     * @return array<string, list<string>>
     */
    public function imports(): array
    {
        $imports = [];

        foreach ($this->declarations->loaders() as $loader) {
            foreach ([
                $loader->inputClass,
                $loader->answerClass,
            ] as $dataClass) {
                $imports[$this->owners->ownerOf($dataClass)][] = class_basename($dataClass);
            }
        }

        ksort($imports);

        return array_map(fn (array $names) => array_values(array_unique($names)), $imports);
    }

    /**
     * Each loader's descriptor: its export name, such as planRows for plans.rows, its key, prop and types.
     *
     * @return list<array{name: string, key: string, prop: string, input: string, answer: string}>
     */
    public function descriptors(): array
    {
        return array_map(fn (RegisteredLoader $loader) => [
            'name' => Str::camel(str_replace('.', '-', $loader->key)),
            'key' => $loader->key,
            'prop' => $loader->prop,
            'input' => class_basename($loader->inputClass),
            'answer' => class_basename($loader->answerClass),
        ], $this->declarations->loaders());
    }
}
