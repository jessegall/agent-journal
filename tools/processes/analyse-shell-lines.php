<?php

declare(strict_types=1);

/*
 * The bounded analysis worker of the full-corpus qualification (doc 21 revision 3, section 35): reads one JSON object
 * per line on standard input, {"id", "source", "dialect"}, parses each source with version 6's shell syntax, and
 * writes one JSON object per line: the opaque id, the outcome and the byte span of every command. It needs no
 * database and executes nothing.
 *
 *   php tools/processes/analyse-shell-lines.php < input.jsonl > results.jsonl
 */

use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\ShellNode;
use Illuminate\Container\Container;
use Illuminate\Contracts\Container\Container as ContainerContract;

require __DIR__.'/../../vendor/autoload.php';

$container = new Container();
$container->instance(ContainerContract::class, $container);
$syntax = $container->make(TreeParser::class);
$input = fopen('php://stdin', 'r') ?: exit(1);
$output = fopen('php://stdout', 'w') ?: exit(1);

while (($line = fgets($input)) !== false) {
    $record = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
    $tree = $syntax->parse($record['source'], ShellDialect::tryFrom($record['dialect']) ?? ShellDialect::Bash);
    $parts = $tree->outcome === ParseOutcome::Complete
        ? array_map(fn (ShellNode $node) => ['start' => $node->range->start, 'end' => $node->range->end], $tree->executableParts())
        : [];
    fwrite($output, json_encode(['id' => $record['id'], 'outcome' => $tree->outcome->value, 'parts' => $parts], JSON_THROW_ON_ERROR)."\n");
}
