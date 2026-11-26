<?php

declare(strict_types=1);

/*
 * The analysis worker of the corpus qualification: it reads one JSON object {"id", "source", "dialect"} per line,
 * parses each source with the journal's shell syntax, and writes the id, the outcome, each command's byte span and a
 * complete line's classification. It reads no database and runs nothing.
 *
 *   php tools/processes/analyse-shell-lines.php < input.jsonl > results.jsonl
 */

use App\Access\Values\ShellNode;
use App\Bus\Contracts\CommandClassifier;
use App\CommandRules\Enums\ParseOutcome;
use App\Processes\Contracts\AliasReader;
use App\Processes\Enums\ShellDialect;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
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
        ? array_map(fn (ShellNode $node) => [
            'start' => $node->range->start,
            'end' => $node->range->end,
        ], $tree->executableParts())
        : [];
    $classification = $tree->outcome === ParseOutcome::Complete ? $classifier->classify($tree, $context)->summary()->toArray() : null;
    fwrite($output, json_encode([
        'id' => $record['id'],
        'outcome' => $tree->outcome->value,
        'parts' => $parts,
        'classification' => $classification,
    ], JSON_THROW_ON_ERROR)."\n");
}
