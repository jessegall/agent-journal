<?php

declare(strict_types=1);

/*
 * Freezes the expected classification of every complete case in tests/Fixtures/Processes/ShellCorpus: whether it is known, the classes it needs and, per part, its program, purpose,
 * unresolved reasons and contract tools, with no saved aliases. Each frozen block was reviewed against the rules of
 * And class-decisions.jsonl names every intended difference from version 5. Run it in the app container only after a
 * reviewed rule change; ShellCorpusTest compares the classifier with what it wrote. Running it twice gives the same
 * bytes.
 *
 *   docker compose -p agent-journal-6 exec -T -e APP_ENV=testing -e DB_DATABASE=journal_hooks_test app \
 *       php tools/processes/freeze-shell-classes.php
 */

use App\Contracts\Bus\CommandClassifier;
use App\Enums\Processes\ShellDialect;
use App\Processes\Contracts\AliasReader;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use Illuminate\Contracts\Console\Kernel;
use Tests\Fixtures\Processes\NoAliases;

const CORPUS = __DIR__.'/../../tests/Fixtures/Processes/ShellCorpus';

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
$app->instance(AliasReader::class, new NoAliases());

$syntax = $app->make(TreeParser::class);
$classifier = $app->make(CommandClassifier::class);
$context = new ExecutionContext(ShellDialect::Bash, '/work', '/work');
$lines = [];
$known = 0;

foreach (file(CORPUS.'/cases.jsonl', FILE_IGNORE_NEW_LINES) ?: [] as $line) {
    $case = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
    unset($case['expected']['classification']);

    if ($case['expected']['outcome'] === 'complete') {
        $summary = $classifier->classify($syntax->parse($case['source'], ShellDialect::from($case['dialect'])), $context)->summary()->toArray();
        $case['expected']['classification'] = $summary;
        $known += $summary['known'] ? 1 : 0;
    }
    $lines[] = json_encode($case, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n";
}
file_put_contents(CORPUS.'/cases.jsonl', implode('', $lines));

$manifest = json_decode((string) file_get_contents(CORPUS.'/manifest.json'), true, 512, JSON_THROW_ON_ERROR);

foreach ([
    'cases.jsonl',
    'class-decisions.jsonl',
] as $name) {
    $manifest['fixtures'][$name] = hash_file('sha256', CORPUS.'/'.$name);
}
file_put_contents(CORPUS.'/manifest.json', json_encode($manifest, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");

fwrite(STDOUT, count($lines)." cases, {$known} classified as known\n");
