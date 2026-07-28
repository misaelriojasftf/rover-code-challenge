import { CalculateSitterRankingUseCase } from '#application/use-cases/calculateSittersRaking.use-case.js';
import { SitterScorePolicy } from '#domain/policies/sitterScore.policy.js';
import { CsvFileAdapter } from '#infrastructure/csv/csvFile.adapter.js';
import { CsvSitterRepository } from '#infrastructure/csv/csvSitter.repository.js';
import { log, logError } from './utils/logger.util.js';

async function run() {
    try {
        log('cli', 'run', 'Application completed successfully');
        const csvFileAdapter = new CsvFileAdapter();
        const csvSitterRepo = new CsvSitterRepository(csvFileAdapter);
        const sitterScorePolicy = new SitterScorePolicy();

        await new CalculateSitterRankingUseCase(csvSitterRepo, sitterScorePolicy).execute();
        log('cli', 'run', 'Application completed successfully');
    } catch (err) {
        logError('cli', 'run', err);
        process.exit(1);
    }
}

run();
