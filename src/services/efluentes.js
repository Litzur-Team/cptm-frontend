import { api, API_BASE } from './api'

export const listEfluentes = () => api.get('/api/Efluente')
export const filtroEfluentes = (params = {}) => {
  const q = new URLSearchParams()
  for (const k of ['municipio', 'linhaCptm', 'statusDesvio', 'estacao']) {
    if (params[k]) q.set(k, params[k])
  }
  const qs = q.toString()
  return api.get(`/api/Efluente/filtro${qs ? '?' + qs : ''}`)
}
export const getEfluente = (id) => api.get(`/api/Efluente/${id}`)
export const createEfluente = (dto) => api.post('/api/Efluente', dto)
export const updateEfluente = (id, dto) => api.put(`/api/Efluente/${id}`, dto)
export const deleteEfluente = (id) => api.del(`/api/Efluente/${id}`)

export const listAnexos = (id) => api.get(`/api/Efluente/${id}/anexos`)
export const uploadAnexo = (id, file) => {
  const fd = new FormData()
  fd.append('arquivo', file)
  return api.postForm(`/api/Efluente/${id}/anexos`, fd)
}
export const anexoUrl = (id, attachmentId) =>
  `${API_BASE}/api/Efluente/${id}/anexos/${attachmentId}`

// Map UI report shape <-> PtEfluenteDto
export function reportToDto(r) {
  return {
    pkCdMeioAmbienteCptm: r.id && Number.isInteger(r.id) ? r.id : 0,
    txNrElementoMonitoramento: r.nrElementoMonitoramento || null,
    txNmElementoMonitoramento: r.nmElementoMonitoramento || null,
    txSiglaDeptMeioAmbiente: r.siglaGEA || null,
    txStatusDoDesvioAmbiental: r.status || 'Pendente',
    txStatusDoRegistroNoBd: 'Ativo',
    txMunicipio: r.municipio || null,
    txLinhaCptm: r.linhaCPTM || null,
    txViaCptm: r.viaCPTM || null,
    txTrechoESentidoCptm: r.trechoSentido || null,
    txKmPoste: r.kmPoste || null,
    txEstacaoCptm: r.estacaoCPTM || null,
    nrLatGrauDecimalWgs84: r.lat ?? null,
    nrLongGrauDecimalWgs84: r.lng ?? null,
    nrLatMetrosSirgas2000: null,
    nrLongMetrosSirgas2000: null,
    txNmLocalEscopoContratual: r.localEscopoContratual || null,
    txTipoDeFormulario: r.tipoFormulario || null,
    dtDataEmissaoFormulario: r.dataEmissaoFormulario ? new Date(r.dataEmissaoFormulario).toISOString() : null,
    nrNumeroDeFormulario: r.numeroFormulario ? String(r.numeroFormulario) : null,
    txAutorPfDoFormulario: r.autorPFFormulario || null,
    txNaturezaDoPga: r.naturezaPGA || null,
    txNomePjExecutora: r.nomePJContratada || null,
    txTipoAtividadeListada: r.tipoAtividadeListada || null,
    txTipoAtividadeNListada: r.tipoAtividadeNaoListada || null,
    txTipoDraListado: r.tipoDRAListado || null,
    txTipoDraNListado: r.tipoDRANaoListado || null,
    txIdDra: r.codDRA || null,
    dtValidadeDra: r.dataValidadeDRA ? new Date(r.dataValidadeDRA).toISOString() : null,
    txAnaliseCptmAprovacao: null,
    txTipoAtividadeCptm: r.tipoAtividadeCPTM || null,
    txNmLocalAtiv: r.nomeLocalAtividade || null,
    txNmLocalAtivComplemento: r.nomeLocalComplemento || null,
    txOrigemEfluente: r.origemEfluente || null,
    txFonteGeradora: r.fonteGeradora || null,
    nrQuantidadeL: r.quantidadeLitros ? Number(r.quantidadeLitros) : null,
    txTipoDestinacao: r.tipoDestinacao || null,
    txTipoVeiculo: r.tipoVeiculo || null,
    txIdVeiculo: r.placaVeiculo || null,
    txIdGuiaRemessa: r.codGuiaRemessa || null,
    nrDistanciaDaViaM: r.distanciaVia ? Number(r.distanciaVia) : null,
    txOferecaRiscoSistemaCptm: null,
    txProprietario: null,
    txObsCadastramento: r.observacoesCadastramento || null,
    dtDataDoCadastramento: r.dataCadastramento ? new Date(r.dataCadastramento).toISOString() : new Date().toISOString(),
    hrHoraDoCadastramento: r.horaCadastramento || null,
    txAutorPjDoCadastro: r.nomePJContratada || null,
    txAutorPfDoCadastro: r.autorPFCadastramento || r.inspector || null,
    txNmResponsavelCadastro: r.responsavelTecnico || null,
    txRpResponsavelCadastro: r.registroProfissional || null,
    txDrtResponsavelCadastro: r.documentoRT || null,
    txNomePjDaContratada: r.nomePJContratada || null,
    txNrContratoContratada: r.nrContratoContratada || null,
    txNmAreaGestoraCptm: r.nomeAreaGestoraCPTM || null,
    txIdAreaGestoraCptm: r.idAreaGestoraCPTM || null,
    txSiglaAreaGestoraCptm: r.siglaAreaGestoraCPTM || null,
    txNomePfDaRepresentante: r.representantePF || null,
    txNomePjDaSupervisora: r.nomePJSupervisora || null,
  }
}

export function dtoToReport(d) {
  const lat = d.nrLatGrauDecimalWgs84
  const lng = d.nrLongGrauDecimalWgs84
  const coords = (lat != null && lng != null) ? `${lat}, ${lng}` : ''
  let date = ''
  if (d.dtDataDoCadastramento) {
    try { date = new Date(d.dtDataDoCadastramento).toLocaleDateString('pt-BR') } catch { date = d.dtDataDoCadastramento }
  }
  return {
    id: d.pkCdMeioAmbienteCptm,
    inspector: d.txAutorPfDoCadastro || '—',
    location: d.txEstacaoCptm || d.txNmLocalAtiv || d.txMunicipio || 'Local não informado',
    coords,
    issue: d.txObsCadastramento || d.txNaturezaDoPga || d.txOrigemEfluente || 'Sem descrição',
    status: d.txStatusDoDesvioAmbiental || 'Pendente',
    date,
    _raw: d,
  }
}
