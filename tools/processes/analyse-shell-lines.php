<?php

declare(strict_types=1);

/*
 * The bounded analysis worker of the full-corpus qualification (doc 21 revision 3, section 35): reads one JSON object
 * per line on standard input, {"id", "source", "dialect"}, parses each source with version 6's shell syntax, and
 * writes one JSON object per line: the opaque id, the outcome, the byte span of every command and, for a complete
 * line, its classification summary with no saved aliases (doc 21 revision 6, section 38). It reads no database and
 * executes nothing.
 *
 *   php tools/processes/analyse-shell-lines.php < input.jsonl > results.jsonl
 */

use App\Processes\Contracts\AliasReader;
use App\Contracts\CommandClassifier;
use App\Enums\ParseOutcome;
use App\Enums\ShellDialect;
use App\Values\ExecutionContext;
use App\Values\ShellNode;
use App\Support\Syntax\TreeParser;
use Illuminate\Contracts\Console\Kernel;
use Tests\Fixtures\Processes\NoAliases;

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
$app->instance(AliasReader::class, new NoAliases());

$syntax = $app->make(TreeParser::class);
$classifier = $app->make(CommandClassifier::class);
$context = new ExecutionContext(ShellDialect::Bash, '/work', '/work');
$input = fopen('php://stdin', 'r') ?: exit(1);
$output = fopen('php://stdout', 'w') ?: exit(1);

while (($line = fgets($input)) !== false) {
    $record = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
    $tree = $syntax->parse($record['source'], ShellDialect::tryFrom($record['dialect']) ?? ShellDialect::Bash);
    $parts = $tree->outcome === ParseOutcome::Complete
        ? array_map(fn (ShellNode $node) => ['start' => $node->range->start, 'end' => $node->range->end], $tree->executableParts())
        : [];
    $classification = $tree->outcome === ParseOutcome::Complete ? $classifier->classify($tree, $context)->summary()->toArray() : null;
    fwrite($output, json_encode(['id' => $record['id'], 'outcome' => $tree->outcome->value, 'parts' => $parts, 'classification' => $classification], JSON_THROW_ON_ERROR)."\n");
}
