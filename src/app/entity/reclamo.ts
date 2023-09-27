export interface AddReclamoRequest{
    tipoDoc : string
    numeroDoc : string
    nombres : string
    apellidos : string
    direccion : string

    medioRespuesta : string
    departmento : string
    provincia: string 
    distrito: string

    email : string
    telefono : string

    apoderadoTipoDoc : string
    apoderadoNumeroDoc : string
    apoderadoNombres: string
    apoderadoApellidos : string

    tipoBien : string
    monto : number
    marca : string
    descripcion : string

    tipoReclamo : string

    detalle : string
    pedidoConsumidor : string

    numFiles : number
}
export interface Reclamo{
    id : number
    correlativo : string
    tipoDoc : string
    numeroDoc : string
    nombres : string
    apellidos : string
    direccion : string

    medioRespuesta : string
    departamento : string
    provincia: string 
    distrito: string

    email : string
    telefono : string

    apoderadoTipoDoc : string
    apoderadoNumeroDoc : string
    apoderadoNombres: string
    apoderadoApellidos : string

    tipoBien : string
    monto : number
    marca : string
    descripcion : string

    tipoReclamo : string

    detalle : string
    pedidoConsumidor : string
    fechaCreacion : string
    fechaRespuesta : string
    respuesta : string
    documentos: Documento[]
}
export interface Documento{
    id : number
    filename : string
    tipo : string
}