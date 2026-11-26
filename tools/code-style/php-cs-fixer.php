<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;
use Tools\CodeStyle\AttributeOrderFixer;
use Tools\CodeStyle\BlankLineAroundMultilineStatementFixer;
use Tools\CodeStyle\StandaloneAttributeFixer;

// The project's own code-style fixers, run after Pint by composer lint and lint:check; at the root, Pint's parallel
// workers would read it without the project's autoloader. The containers' PHP is newer than the fixer's declared range,
// but its fixers only read this project's code.
return new Config()
    ->setUnsupportedPhpVersionAllowed(true)
    ->setParallelConfig(ParallelConfigFactory::detect())
    ->registerCustomFixers([
        new BlankLineAroundMultilineStatementFixer(),
        new StandaloneAttributeFixer(),
        new AttributeOrderFixer(),
    ])
    ->setRules([
        'Journal/blank_line_around_multiline_statement' => true,
        'Journal/standalone_attribute' => true,
        'Journal/attribute_order' => true,
    ])
    ->setUsingCache(true)
    ->setCacheFile('storage/framework/cache/php-cs-fixer.cache')
    ->setFinder(new Finder()->in([
        dirname(__DIR__, 2).'/app',
        dirname(__DIR__, 2).'/domain',
    ])->exclude([
        'resources',
        'node_modules',
    ]));
