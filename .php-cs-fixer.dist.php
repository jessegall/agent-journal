<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;
use Tools\CodeStyle\AttributeOrderFixer;
use Tools\CodeStyle\BlankLineAroundMultilineStatementFixer;
use Tools\CodeStyle\StandaloneAttributeFixer;

// The project's own code-style fixers, run right after Pint (which cannot load them) by composer lint and lint:check.
return new Config()
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
    ->setFinder(new Finder()->in(['app', 'domain'])->exclude(['resources', 'node_modules']));
